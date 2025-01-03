import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
  } from "@material-tailwind/react";
import Request from "./Request";
import Table from "./Table";
import useAxios from "../../hooks/useAxios/useAxios";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth/useAuth";




   
  export function DepositPage() {

    const axiosCommon = useAxios()
    const { user } = useAuth();
    const { data:info = [], isLoading, isError,refetch } = useQuery({
        queryKey: ["my-deposit",user?.email],
        queryFn: async () => {
          const { data } = await axiosCommon.get(`/deposit/${user?.email}`);
          return data;
        },
      });


    const data = [
      {
        label: "Make Request",
        value: "request",
        desc: <Request refetch={refetch}/>,
      },
      {
        label: "Hisorty",
        value: "history",
        desc: <Table data={info} isLoading={isLoading} isError={isError}/>,
      },
   
      
    ];


   
    return (
      <Tabs value='request' className="min-h-screen p-4 bg-background text-text-primary" id="custom-animation" >
        <TabsHeader  className="mt-20">
          {data.map(({ label, value }) => (
            <Tab  key={value} value={value}>
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