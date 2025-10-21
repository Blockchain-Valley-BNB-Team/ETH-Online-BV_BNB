"""
블록체인 서비스
Web3.py를 사용하여 Base Sepolia 체인과 상호작용
"""

from web3 import Web3
from eth_account import Account
import json
import os
from typing import Dict


class BlockchainService:
    """Base Sepolia 블록체인과 상호작용하는 서비스"""
    
    def __init__(self):
        """블록체인 서비스 초기화"""
        rpc_url = os.getenv("BASE_SEPOLIA_RPC_URL", "https://sepolia.base.org")
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        
        # 컨트랙트 주소 및 ABI 로드
        self.contract_address = os.getenv("RESEARCH_REGISTRY_ADDRESS")
        
        if not self.contract_address:
            print("Warning: RESEARCH_REGISTRY_ADDRESS not set. Blockchain features will be disabled.")
            self.contract = None
            self.account = None
            return
        
        # 체크섬 주소로 변환
        self.contract_address = Web3.to_checksum_address(self.contract_address)
        
        # ABI 로드
        self.contract_abi = self._load_contract_abi()
        
        # 컨트랙트 인스턴스 생성
        self.contract = self.w3.eth.contract(
            address=self.contract_address,
            abi=self.contract_abi
        )
        
        # 서버 계정 설정 (트랜잭션 전송용)
        private_key = os.getenv("SERVER_PRIVATE_KEY")
        if private_key:
            self.account = Account.from_key(private_key)
            print(f"Blockchain service initialized with account: {self.account.address}")
        else:
            print("Warning: SERVER_PRIVATE_KEY not set. Cannot send transactions.")
            self.account = None
    
    def _load_contract_abi(self) -> list:
        """
        컨트랙트 ABI 로드
        contract_abi.json 파일에서 로드하거나 하드코딩된 ABI 사용
        """
        abi_file = "contract_abi.json"
        
        if os.path.exists(abi_file):
            with open(abi_file, "r") as f:
                return json.load(f)
        
        # 기본 ABI (ResearchRegistry 컨트랙트)
        return [
            {
                "inputs": [
                    {"internalType": "address", "name": "_researcher", "type": "address"},
                    {"internalType": "string", "name": "_resultData", "type": "string"},
                    {"internalType": "string", "name": "_sessionId", "type": "string"}
                ],
                "name": "storeResearch",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {"internalType": "address", "name": "_researcher", "type": "address"},
                    {"internalType": "uint256", "name": "_researchId", "type": "uint256"}
                ],
                "name": "getResearch",
                "outputs": [
                    {
                        "components": [
                            {"internalType": "address", "name": "researcher", "type": "address"},
                            {"internalType": "string", "name": "resultData", "type": "string"},
                            {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
                            {"internalType": "string", "name": "sessionId", "type": "string"}
                        ],
                        "internalType": "struct ResearchRegistry.ResearchResult",
                        "name": "",
                        "type": "tuple"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {"internalType": "address", "name": "_researcher", "type": "address"}
                ],
                "name": "getResearchCount",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "anonymous": False,
                "inputs": [
                    {"indexed": True, "internalType": "address", "name": "researcher", "type": "address"},
                    {"indexed": True, "internalType": "uint256", "name": "researchId", "type": "uint256"},
                    {"indexed": False, "internalType": "string", "name": "sessionId", "type": "string"},
                    {"indexed": False, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
                ],
                "name": "ResearchStored",
                "type": "event"
            }
        ]
    
    async def store_research(
        self,
        researcher_address: str,
        result_data: str,
        session_id: str
    ) -> Dict:
        """
        연구 결과를 블록체인에 저장
        
        Args:
            researcher_address: 연구자 지갑 주소
            result_data: 연구 결과 데이터
            session_id: 세션 ID
            
        Returns:
            Dict: 트랜잭션 결과
        """
        if not self.contract or not self.account:
            raise Exception("Blockchain service not properly configured")
        
        # 주소를 체크섬 형식으로 변환
        researcher_address = Web3.to_checksum_address(researcher_address)
        
        # 결과 데이터 요약 (가스비 절약)
        # 최대 500자로 제한 (더 짧게 요약하여 가스 절약)
        truncated_data = result_data[:500] if len(result_data) > 500 else result_data
        
        # 가스 추정
        try:
            estimated_gas = self.contract.functions.storeResearch(
                researcher_address,
                truncated_data,
                session_id
            ).estimate_gas({
                'from': self.account.address
            })
            # 추정치의 1.5배로 설정 (여유 확보)
            gas_limit = int(estimated_gas * 1.5)
            print(f"Estimated gas: {estimated_gas}, Using gas limit: {gas_limit}")
        except Exception as e:
            print(f"Gas estimation failed: {e}, using default 1,000,000")
            gas_limit = 1000000
        
        # 트랜잭션 빌드
        tx = self.contract.functions.storeResearch(
            researcher_address,
            truncated_data,
            session_id
        ).build_transaction({
            'from': self.account.address,
            'nonce': self.w3.eth.get_transaction_count(self.account.address),
            'gas': gas_limit,
            'gasPrice': self.w3.eth.gas_price
        })
        
        # 트랜잭션 서명
        signed_tx = self.w3.eth.account.sign_transaction(tx, self.account.key)
        
        # 트랜잭션 전송
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        print(f"Transaction sent: {tx_hash.hex()}")
        
        # 트랜잭션 영수증 대기
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        
        # 이벤트에서 research_id 추출
        logs = self.contract.events.ResearchStored().process_receipt(receipt)
        research_id = logs[0]['args']['researchId'] if logs else 0
        
        return {
            "transaction_hash": receipt['transactionHash'].hex(),
            "research_id": research_id,
            "gas_used": receipt['gasUsed'],
            "block_number": receipt['blockNumber']
        }
    
    def is_connected(self) -> bool:
        """블록체인 연결 상태 확인"""
        if not self.w3:
            return False
        return self.w3.is_connected()
    
    async def get_research(self, researcher_address: str, research_id: int) -> Dict:
        """
        블록체인에서 연구 결과 조회
        
        Args:
            researcher_address: 연구자 주소
            research_id: 연구 ID
            
        Returns:
            Dict: 연구 결과
        """
        if not self.contract:
            raise Exception("Blockchain service not properly configured")
        
        researcher_address = Web3.to_checksum_address(researcher_address)
        
        result = self.contract.functions.getResearch(
            researcher_address,
            research_id
        ).call()
        
        return {
            "researcher": result[0],
            "result_data": result[1],
            "timestamp": result[2],
            "session_id": result[3]
        }

