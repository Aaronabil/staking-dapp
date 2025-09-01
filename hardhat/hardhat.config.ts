  import { HardhatUserConfig } from "hardhat/config";
  import "@nomicfoundation/hardhat-toolbox";
  import "dotenv/config";

  const sepoliaRpcUrl = process.env.SEPOLIA_RPC_URL || "";
  const privateKey = process.env.PRIVATE_KEY || "";

  const config: HardhatUserConfig = {
    solidity: "0.8.28",
    networks: {
      sepolia: {
        url: sepoliaRpcUrl,
        accounts: [privateKey],
        chainId: 11155111,
      },
    },
  };

  export default config;
