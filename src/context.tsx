import React, {
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import {
  loadStdlib,
  ALGO_WalletConnect as WalletConnect,
} from "@reach-sh/stdlib";
// @ts-ignore
import * as backend from "./reach/build/index.main.mjs";

// @ts-ignore
const reach = loadStdlib("ALGO");

reach.setWalletFallback(
  reach.walletFallback({
    providerEnv: "TestNet",
    WalletConnect,
  })
);
export type modalType = "launch" | "message" | "subscribe" | "none";
export const useDefaultContext = () => useContext(AppContext);

const AppContext = React.createContext(
  {} as {
    state: any;
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    setState: React.Dispatch<React.SetStateAction<{}>>;
    wallet: any;
    setWallet: React.Dispatch<React.SetStateAction<{}>>;
    modalMessage: any;
    setModalMessage: React.Dispatch<any>;
    view: modalType;
    setView: React.Dispatch<React.SetStateAction<modalType>>;
    isOpen: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    createAsyncTimeout: (
      seconds: number,
      executable?: () => any
    ) => Promise<void>;
    displayMessage: (
      show: boolean,
      message?: string | JSX.Element,
      options?: {
        type: modalType;
      }
    ) => void;
    isConnected: boolean;
    setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
    Api: {
      subscribe: (somn: number) => Promise<any>;
      Submit_claim: (claim: string, funds: number) => Promise<any>;
      getBalance: () => Promise<number | any>;
      displayBalance: () => Promise<void>;
      acc: any;
    };
    connectWallet: () => Promise<void>;
    DisconnectWallet: () => void;
  }
);
export const AppProvider = ({ children }: PropsWithChildren) => {
  const [isConnected, setIsConnected] = useState(false);
  const [contractInfo, setContractInfo] = useState("" as string);
  const [state, setState] = useState({});
  const [wallet, setWallet] = useState({} as any);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("Hello" as any);
  const [view, setView] = useState<modalType>("none");
  const [isOpen, setOpen] = useState(false);
  const [Api, setApi] = useState(
    {} as {
      subscribe: (somn: number) => Promise<any>;
      Submit_claim: (claim: string, funds: number) => Promise<any>;
      getBalance: () => Promise<number | any>;
      displayBalance: () => Promise<void>;
      acc: any;
    }
  );

  const displayMessage = (
    show: boolean,
    message?: string | JSX.Element,
    options?: { type: modalType }
  ) => {
    setShowModal(show);
    setView(options?.type ?? show ? "message" : "none");
    setModalMessage(message);
  };
  const connectWallet = async () => {
    try {
      const acct = await Insurer();
      setWallet(acct.acc);
      setApi(acct);
      setIsConnected(true);
      console.log(acct);
      return acct.acc;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  const createAsyncTimeout = async (seconds: number) => {
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve(null);
      }, seconds * 1000)
    );
  };

  const DisconnectWallet = async () => {
    window.localStorage.removeItem("walletconnect");
    setIsConnected(false);
  };

  const Insurer = async () => {
    const acc = await reach.getDefaultAccount();
    const ctc = () =>
      acc.contract(
        backend,
        // @ts-ignore
        reach.bigNumberToNumber(contractInfo)
      );

    const subscribe = async (howMany: number) => {
      try {
        const pay = reach.parseCurrency(howMany);
        const res = await ctc().apis.Subscribers.subscribe(pay);
        console.log(res);
        return res;
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    const Submit_claim = async (claim: string, funds: number) => {
      try {
        const rf = reach.parseCurrency(funds);
        const res = await ctc().apis.Subscribers.Submit_claim(claim, rf);
        console.log(res);
        return res;
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    const getBalance = async () => {
      return await reach.balanceOf(acc);
    };

    const displayBalance = async () => {
      const bal = await getBalance();
      console.log(`s balance: ${reach.formatCurrency(bal, 4)}`);
    };

    return {
      subscribe,
      Submit_claim,
      getBalance,
      displayBalance,
      acc,
    };
  };

  const deploy = async (acc:any) => {
    const ctcInsurance = await acc?.contract(backend) ?? await wallet?.contract(backend);
    await Promise.all([
      ctcInsurance.p.Insurance_company({
        Sub_amt: async () => {
          console.log(`The minimum amount for subscription is ${1}`);
          return 1;
        },
        Check_claim: async (clm: string) => {
          console.log(
            `The insurance company saw claim : ${clm}\nAwaiting decision................`
          );

          if (true) {
            console.log(`Your claim was approved`);
            return true;
          } else {
            console.log(`Your claim was denied`);
            return false;
          }
        },
        Check_pay: async (sub_pay: number) => {
          console.log(
            // @ts-ignore
            `seen cash :  ${reach.formatCurrency(sub_pay,)} ${
              reach.standardUnit
            }`
          );

          if (sub_pay >= Number(reach.parseCurrency(1))) {
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
    ]);
  };

  // useEffect(()=>{
  //   (async()=>{
  //   const acct=   await connectWallet();
 
  //      await  deploy(acct)
      
  //   })()
  // },[])
  return (
    <AppContext.Provider
      value={{
        Api,
        DisconnectWallet,
        createAsyncTimeout,
        connectWallet,
        state,
        setState,
        wallet,
        setWallet,
        modalMessage,
        setModalMessage,
        showModal,
        setShowModal,
        view,
        isOpen,
        setOpen,
        setView,
        displayMessage,
        isConnected,
        setIsConnected,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
