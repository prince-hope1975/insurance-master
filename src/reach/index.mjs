import { loadStdlib } from "@reach-sh/stdlib";
import * as backend from "./build/index.main.mjs";
import { ask, yesno } from "@reach-sh/stdlib/ask.mjs";

const stdlib = await loadStdlib(process.env);
const startingBalance = stdlib.parseCurrency(10000);

const accInsurance = await stdlib.newTestAccount(stdlib.parseCurrency(100000));
const Subscribersacc = await stdlib.newTestAccounts(10, startingBalance);

const ctcInsurance = accInsurance.contract(backend);

const showBalance = async (acc, name) => {
  const amt = await stdlib.balanceOf(acc);
  console.log(
    `${name} has ${stdlib.formatCurrency(amt)} ${stdlib.standardUnit}`
  );
};

const subscribe = async (accs, p) => {
  //payamount and true or false if paid
  try {
    const ctc = accs.contract(backend, ctcInsurance.getInfo());
    const pay = stdlib.parseCurrency(p);
    await ctc.apis.Subscribers.Subscribe(pay);
  } catch (error) {
    console.log(error);
  }
};

const Submit_claim = async (accs, claim, funds) => {
  //payamount and true or false if paid
  try {
    const ctc = accs.contract(backend, ctcInsurance.getInfo());
    const rf = stdlib.parseCurrency(funds);
    await ctc.apis.Subscribers.Submit_claim(claim, rf);
  } catch (error) {
    console.log(error);
  }
};

const pay_amount = await ask(`what is the minimum pay for subcription: `);
const dd = stdlib.parseCurrency(pay_amount);

await Promise.all([
  ctcInsurance.p.Insurance_company({
    Sub_amt: async () => {
      console.log(`The minimum amount for subscription is ${pay_amount}`);
      return parseInt(pay_amount);
    },
    Check_claim: async (clm) => {
      console.log(
        `The insurance company saw claim : ${clm}\nAwaiting decision................`
      );
      const decision = await ask(
        `what's your decision 1 for approve and 0 for deny`
      );
      if (parseInt(decision) == 1) {
        console.log(`Your claim was approved`);
        return true;
      } else {
        console.log(`Your claim was denied`);
        return false;
      }
    },
    Check_pay: async (sub_pay) => {
      console.log(
        `seen cash :  ${stdlib.formatCurrency(sub_pay)} ${stdlib.standardUnit}`
      );

      if (sub_pay >= dd) {
        console.log(`Your pay to the dapp was approved`);
        return true;
      } else {
        console.log(`Your pay was declined\nAwait your pay refund`);
        return false;
      }
    },
    deny_claim: async () => {
      console.log(`sorry your claim was denied\n Due to suspected fraud`);
    },
  }),
  await subscribe(Subscribersacc[0], 6000),
  await subscribe(Subscribersacc[1], 5500),
  await subscribe(Subscribersacc[2], 7000),
  await subscribe(Subscribersacc[3], 5000),
  await subscribe(Subscribersacc[4], 7000),
  await subscribe(Subscribersacc[5], 8000),
  await subscribe(Subscribersacc[6], 5200),
  await subscribe(Subscribersacc[7], 6000),
  await subscribe(Subscribersacc[8], 6000),
  await subscribe(Subscribersacc[9], 6000),
  await Submit_claim(Subscribersacc[0], "my car got stolen", 10000),
  await Submit_claim(Subscribersacc[1], "my house got burnt", 13000),
  await Submit_claim(Subscribersacc[2], "i had a car accident", 7000),
  await Submit_claim(Subscribersacc[3], "need new car ", 4000),
  await Submit_claim(Subscribersacc[4], "i want money", 3500),
  await Submit_claim(Subscribersacc[5], "my car got stolen", 9000),
  await Submit_claim(Subscribersacc[6], "my car got stolen", 20000),
  await Submit_claim(Subscribersacc[7], "my car got stolen", 15000),
  await Submit_claim(Subscribersacc[8], "my car got stolen", 30000),
  await Submit_claim(Subscribersacc[9], "my car got stolen", 70000),
]);
await showBalance(accInsurance, "The Insurance company");
await showBalance(Subscribersacc[0], "steve");
await showBalance(Subscribersacc[1], "emeka");
await showBalance(Subscribersacc[2], "chibike");
await showBalance(Subscribersacc[3], "jerry");
await showBalance(Subscribersacc[4], "james");
await showBalance(Subscribersacc[5], "hana");
await showBalance(Subscribersacc[6], "chibby");
await showBalance(Subscribersacc[7], "chizzy");
await showBalance(Subscribersacc[8], "terry");
await showBalance(Subscribersacc[9], "jacob");

process.exit();
