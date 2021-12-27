import React, { FunctionComponent, useState, useEffect } from "react"
import Button from "@components/Button"
import { HorizontalListGroup } from "@components/ListGroupMods"
import { ListGroupItem } from "shards-react"
import { InputWithTitle } from "@components/Input"
import { useOnEarn } from "@hooks/earnings"
import { useActiveWeb3React, useWeb3Contract } from "@hooks/index"
import { SmallUniversalContainer, Title } from "@components/global.styles"
import ConnectWalletAlert from "@components/ConnectWalletAlert"
import styled from "styled-components"
import { ARB_ABC_PRESALE } from "@config/constants"
import ABC_PRESALE_ABI from "@config/contracts/ABC_PRESALE_ABI.json"
import { formatEther } from "ethers/lib/utils"
import { useGetCurrentNetwork } from "@state/application/hooks"

export const VerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  grid-gap: 15px;
  max-width: 100%;
  overflow: hidden;
`

export const MaxWidthItem = styled(ListGroupItem)`
  width: 100%;
`

const Earnings: FunctionComponent = () => {
  const { account } = useActiveWeb3React()
  const [earningsVal, setEarningsVal] = useState("")
  const [isLoading, setLoading] = useState(false)
  const getPresaleContract = useWeb3Contract(ABC_PRESALE_ABI)
  const networkSymbol = useGetCurrentNetwork()

  const { onEarn, isPending } = useOnEarn()

  const loadData = async () => {
    setLoading(true)
    const presaleRead = getPresaleContract(ARB_ABC_PRESALE)
    const earned = await presaleRead.methods.getTokensEarned(account).call()
    setEarningsVal(formatEther(earned))
    setLoading(false)
  }

  useEffect(() => {
    if (
      networkSymbol === "AETH" &&
      account !== undefined &&
      account !== null &&
      earningsVal === ""
    ) {
      loadData()
    }
  }, [account, getPresaleContract, networkSymbol])

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
        <Title>Earn</Title>
        <HorizontalListGroup>
          <MaxWidthItem>
            <InputWithTitle
              title="Earnings ($ABC)"
              id="earnings"
              placeholder="0"
              value={earningsVal}
              disabled
            />
          </MaxWidthItem>
        </HorizontalListGroup>
        <VerticalContainer style={{ marginTop: 35, alignItems: "center" }}>
          <HorizontalListGroup>
            <div style={{ padding: "0 8px", width: "100%" }} id="claimEarnings">
              <Button
                disabled={isPending || Number(earningsVal) === 0}
                style={{ width: "100%" }}
                type="button"
                onClick={() => {
                  onEarn(() => loadData())
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

export default Earnings
