import React, { FunctionComponent, useState, useEffect } from "react"
import Button from "@components/Button"
import { HorizontalListGroup } from "@components/ListGroupMods"
import { InputWithTitleAndButton } from "@components/Input"
import { useOnWhitelist } from "@hooks/whitelist"
import { useActiveWeb3React, useWeb3Contract } from "@hooks/index"
import { SmallUniversalContainer, Title } from "@components/global.styles"
import ConnectWalletAlert from "@components/ConnectWalletAlert"
import { VerticalContainer, MaxWidthItem } from "@sections/Earnings"
import { ARB_ABC_PRESALE } from "@config/constants"
import ABC_PRESALE_ABI from "@config/contracts/ABC_PRESALE_ABI.json"

const Whitelist: FunctionComponent = () => {
  const { account } = useActiveWeb3React()
  const [isWhitelisted, setIsWhitelisted] = useState(true)
  const [purchaseVal, setPurchaseVal] = useState("")
  const [isLoading, setLoading] = useState(false)
  const getPresaleContract = useWeb3Contract(ABC_PRESALE_ABI)

  const { onWhitelist, isPending } = useOnWhitelist()

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const presaleRead = getPresaleContract(ARB_ABC_PRESALE)
      const whitelist = await presaleRead.methods.whitelist(account).call()
      setIsWhitelisted(whitelist)
      setLoading(false)
    }
    if (account !== undefined && account !== null) {
      loadData()
    }
  }, [account, getPresaleContract])

  if (!account) {
    return (
      <SmallUniversalContainer
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <ConnectWalletAlert />
      </SmallUniversalContainer>
    )
  }

  if (isLoading) {
    return (
      <SmallUniversalContainer
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        Loading... {/* TODO: find a loader */}
      </SmallUniversalContainer>
    )
  }

  if (!isWhitelisted) {
    return (
      <SmallUniversalContainer
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        Please ensure you are logged into a whitelisted wallet to access this
        page!
      </SmallUniversalContainer>
    )
  }

  return (
    <SmallUniversalContainer style={{ alignItems: "center" }}>
      <VerticalContainer style={{ maxWidth: 800 }}>
        <Title>Whitelist</Title>
        <HorizontalListGroup>
          <MaxWidthItem>
            <InputWithTitleAndButton
              title="Pre-sale purchase (up to 0.125 ETH)"
              id="purchaseAmount"
              placeholder="Enter purchase amount in ETH"
              value={purchaseVal}
              onChange={(e) => setPurchaseVal(e.target.value)}
              buttonText="Max"
              onClick={() => setPurchaseVal(`0.125`)}
            />
          </MaxWidthItem>
        </HorizontalListGroup>
        <VerticalContainer style={{ marginTop: 35, alignItems: "center" }}>
          <HorizontalListGroup>
            <div style={{ padding: "0 8px", width: "100%" }} id="claimEarnings">
              <Button
                disabled={
                  isPending || Number(purchaseVal) === 0 || purchaseVal === ""
                }
                style={{ width: "100%" }}
                type="button"
                onClick={() => {
                  if (Number(purchaseVal) > 0.125) {
                    alert("You inputted too high of a purchase amount")
                    return
                  }
                  onWhitelist(purchaseVal)
                }}
              >
                {isPending ? "Pending..." : "Claim Airdrop"}
              </Button>
            </div>
          </HorizontalListGroup>
        </VerticalContainer>
      </VerticalContainer>
    </SmallUniversalContainer>
  )
}

export default Whitelist
