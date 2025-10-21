import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ResearchRegistryModule", m => {
  const researchRegistry = m.contract("ResearchRegistry");

  return { researchRegistry };
});
