import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
  } from "@material-tailwind/react";
import RequestPage from "./RequestPage";
import History from "./History";
import useAxios from "../../hooks/useAxios/useAxios";
import useAuth from "../../hooks/useAuth/useAuth";
import { useQuery } from "@tanstack/react-query";




   
  export function WithdrowPage() {
  
    const axiosCommon = useAxios()
    const { user } = useAuth();
      const { data:info, isLoading, isError, refetch } = useQuery({
        queryKey: ["my-withdrawals",user?.email],
        queryFn: async () => {
          const { data } = await axiosCommon.get(`/withdraw/${user?.email}`);
          return data;
        },
      });
console.log(info);
    const data = [
      {
        label: "Make Request",
        value: "request",
        desc: <RequestPage refetch={refetch}/>,
      },
      {
        label: "Hisorty",
        value: "history",
        desc: <History info={info} isError={isError} isLoading={isLoading}/>,
      },
   
      
    ];


   
    return (
      <Tabs value='request' className="min-h-screen p-4 bg-background text-text-primary" id="custom-animation" >
        <TabsHeader className="mt-20">
          {data.map(({ label, value }) => (
            <Tab key={value} value={value}>
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody
          animate={{
            initial: { y: 250 },
            mount: { y: 0 },
            unmount: { y: 250 },
          }}
        >
          {data.map(({ value, desc }) => (
            <TabPanel className="p-0"  key={value} value={value}>
              {desc}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    );
  }