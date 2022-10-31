//Esto es para conectarme a la blockchain
const ethers = require("ethers");

//Para leer archivos de texto
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  //Puedo usar variables de ENV para evitar poner nuestras llaves en el codigo directamente.
  //Con .gitignore, evito subir los archivos .env
  let provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  let wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");

  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait...");
  const contract = await contractFactory.deploy();

  //para interactuar con los metodos de mi contrato, como hacia en remix

  //invoco el metodo guardar, para guadar un numero nuevo favorito
  const transactionResponse = await contract.store("8");

  //Espero 1 bloque para confirmar que esta en mi blockchain
  const TransaccionReceipt = await contract.deployTransaction.wait(1);

  //Llamo a mi metodo retrieve para que me devuelve el nuevo numero favorito
  const currentFavoriteNumber = await contract.retrieve();
  console.log(currentFavoriteNumber.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
