import GlobalLayout from "@layouts/index"
import Whitelist from "@sections/Whitelist"
import React from "react"

const IndexPage = (props: any) => (
  <GlobalLayout {...props}>
    <Whitelist />
  </GlobalLayout>
)

export default IndexPage
