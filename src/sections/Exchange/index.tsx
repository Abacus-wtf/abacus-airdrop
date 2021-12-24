import React, { FunctionComponent, useState, useEffect } from "react"
import Button from "@components/Button"
import { HorizontalListGroup } from "@components/ListGroupMods"
import { InputWithTitleAndButton } from "@components/Input"
import { useOnExchange } from "@hooks/exchange"
import { useActiveWeb3React, useWeb3Contract } from "@hooks/index"
import { SmallUniversalContainer, Title } from "@components/global.styles"
import ConnectWalletAlert from "@components/ConnectWalletAlert"
import { VerticalContainer, MaxWidthItem } from "@sections/Earnings"
import { ARB_ABC_PRESALE } from "@config/constants"
import ABC_PRESALE_ABI from "@config/contracts/ABC_PRESALE_ABI.json"
import { formatEther } from "ethers/lib/utils"

const Exchange: FunctionComponent = () => {
  const { account } = useActiveWeb3React()
  const [totalAmountPossible, setTotalAmountPossible] = useState("-")
  const [exchangeAmount, setExchangeAmount] = useState("")
  const [isLoading, setLoading] = useState(false)
  const getPresaleContract = useWeb3Contract(ABC_PRESALE_ABI)

  const { onExchange, isPending } = useOnExchange()

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const pricingSessionRead = getPresaleContract(ARB_ABC_PRESALE)
      const earned = await pricingSessionRead.methods.earned(account).call()
      setTotalAmountPossible(formatEther(earned))
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

  return (
    <SmallUniversalContainer style={{ alignItems: "center" }}>
      <VerticalContainer style={{ maxWidth: 800 }}>
        <Title>Exchange</Title>
        <HorizontalListGroup>
          <MaxWidthItem>
            <InputWithTitleAndButton
              title={`Exchange up to ${totalAmountPossible} $ABC`}
              id="purchaseAmount"
              placeholder="Enter purchase amount in $ABC"
              value={exchangeAmount}
              onChange={(e) => setExchangeAmount(e.target.value)}
              buttonText="Max"
              onClick={() => setExchangeAmount(`${totalAmountPossible}`)}
            />
          </MaxWidthItem>
        </HorizontalListGroup>
        <VerticalContainer style={{ marginTop: 35, alignItems: "center" }}>
          <HorizontalListGroup>
            <div style={{ padding: "0 8px", width: "100%" }} id="claimEarnings">
              <Button
                disabled={
                  isPending ||
                  Number(exchangeAmount) === 0 ||
                  exchangeAmount === ""
                }
                style={{ width: "100%" }}
                type="button"
                onClick={() => {
                  if (Number(exchangeAmount) > Number(totalAmountPossible)) {
                    alert("You tried to purchase more than you are alloted.")
                    return
                  }
                  onExchange(exchangeAmount)
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

export default Exchange
