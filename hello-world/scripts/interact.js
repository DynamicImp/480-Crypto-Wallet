const hre = require("hardhat");

async function main() {
  const contractAddress = "0x30Da804137Ffd1E801618be9b348282C0fc11262";
  
  const HelloWorld = await hre.ethers.getContractFactory("HelloWorld");
  const helloWorld = HelloWorld.attach(contractAddress);

  console.log("Reading current message...");
  const message = await helloWorld.message();
  console.log("Current message:", message);

  console.log("Updating the message...");
  const tx = await helloWorld.update("Hello from the interaction script!");

  await tx.wait();
  console.log("Transaction confirmed.");

  const newMessage = await helloWorld.message();
  console.log("New message:", newMessage);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});