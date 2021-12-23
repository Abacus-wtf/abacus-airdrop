import GlobalLayout from "@layouts/index"
import Exchange from "@sections/Exchange"
import React from "react"

const IndexPage = (props: any) => (
  <GlobalLayout {...props}>
    <Exchange />
  </GlobalLayout>
)

export default IndexPage
