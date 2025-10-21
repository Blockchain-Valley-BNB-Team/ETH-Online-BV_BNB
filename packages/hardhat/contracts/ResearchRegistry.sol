//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

/**
 * @title ResearchRegistry
 * @notice Gene Analysis Tool의 연구 결과를 블록체인에 저장하는 컨트랙트
 * @dev 각 연구자의 연구 결과를 저장하고 조회할 수 있는 레지스트리
 */
contract ResearchRegistry {
    // 연구 결과 구조체
    struct ResearchResult {
        address researcher; // 연구 요청자 주소
        string resultData; // 연구 결과 데이터 (요약 또는 IPFS 해시)
        uint256 timestamp; // 저장 시간
        string sessionId; // 세션 ID
    }

    // 연구자 주소 => 연구 ID => 연구 결과
    mapping(address => mapping(uint256 => ResearchResult)) public researchResults;

    // 연구자 주소 => 총 연구 횟수
    mapping(address => uint256) public researchCount;

    // 이벤트: 연구 결과가 저장될 때 발생
    event ResearchStored(address indexed researcher, uint256 indexed researchId, string sessionId, uint256 timestamp);

    /**
     * @notice 연구 결과를 블록체인에 저장
     * @param _researcher 연구자 주소
     * @param _resultData 연구 결과 데이터
     * @param _sessionId 세션 ID
     * @return researchId 저장된 연구의 ID
     */
    function storeResearch(
        address _researcher,
        string memory _resultData,
        string memory _sessionId
    ) public returns (uint256) {
        require(_researcher != address(0), "Invalid researcher address");
        require(bytes(_resultData).length > 0, "Result data cannot be empty");
        require(bytes(_sessionId).length > 0, "Session ID cannot be empty");

        uint256 researchId = researchCount[_researcher];

        researchResults[_researcher][researchId] = ResearchResult({
            researcher: _researcher,
            resultData: _resultData,
            timestamp: block.timestamp,
            sessionId: _sessionId
        });

        researchCount[_researcher]++;

        console.log("Research stored for %s with ID %s", _researcher, researchId);

        emit ResearchStored(_researcher, researchId, _sessionId, block.timestamp);

        return researchId;
    }

    /**
     * @notice 특정 연구 결과 조회
     * @param _researcher 연구자 주소
     * @param _researchId 연구 ID
     * @return ResearchResult 연구 결과
     */
    function getResearch(address _researcher, uint256 _researchId) public view returns (ResearchResult memory) {
        require(_researchId < researchCount[_researcher], "Research ID does not exist");
        return researchResults[_researcher][_researchId];
    }

    /**
     * @notice 연구자의 모든 연구 결과 개수 조회
     * @param _researcher 연구자 주소
     * @return count 연구 결과 개수
     */
    function getResearchCount(address _researcher) public view returns (uint256) {
        return researchCount[_researcher];
    }

    /**
     * @notice 연구자의 최신 연구 결과 조회
     * @param _researcher 연구자 주소
     * @return ResearchResult 최신 연구 결과
     */
    function getLatestResearch(address _researcher) public view returns (ResearchResult memory) {
        require(researchCount[_researcher] > 0, "No research found for this address");
        uint256 latestId = researchCount[_researcher] - 1;
        return researchResults[_researcher][latestId];
    }
}
