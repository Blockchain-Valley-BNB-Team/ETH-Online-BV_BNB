import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import hre from "hardhat";

/**
 * ResearchRegistry 컨트랙트를 간단히 배포하는 스크립트
 * 환경변수에서 개인키를 읽어서 배포합니다
 */
async function main() {
  console.log("Deploying ResearchRegistry to", hre.network.name);

  // Ignition 모듈 정의
  const ResearchRegistryModule = buildModule("ResearchRegistryModule", m => {
    const researchRegistry = m.contract("ResearchRegistry");
    return { researchRegistry };
  });

  // 배포 실행
  const { researchRegistry } = await hre.ignition.deploy(ResearchRegistryModule);

  const address = await researchRegistry.getAddress();

  console.log("\n✅ ResearchRegistry deployed successfully!");
  console.log("📍 Contract address:", address);
  console.log("🔗 Network:", hre.network.name);
  console.log("\n💡 Add this to your backend .env file:");
  console.log(`RESEARCH_REGISTRY_ADDRESS=${address}`);
  console.log("\n🔍 View on BaseScan:");
  console.log(`https://sepolia.basescan.org/address/${address}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
