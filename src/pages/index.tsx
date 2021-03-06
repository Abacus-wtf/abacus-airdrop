import GlobalLayout from "@layouts/index"
import Earnings from "@sections/Earnings"
import React from "react"

const IndexPage = (props: any) => (
  <GlobalLayout {...props}>
    <Earnings />
  </GlobalLayout>
)

export default IndexPage
