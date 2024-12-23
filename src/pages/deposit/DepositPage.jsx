import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
  } from "@material-tailwind/react";
import Request from "./Request";
import Table from "./Table";




   
  export function DepositPage() {
    const data = [
      {
        label: "Make Request",
        value: "request",
        desc: <Request/>,
      },
      {
        label: "Hisorty",
        value: "history",
        desc: <Table/>,
      },
   
      
    ];


   
    return (
      <Tabs value='request' className="px-4 mt-5" id="custom-animation" >
        <TabsHeader>
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
            <TabPanel  key={value} value={value}>
              {desc}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    );
  }