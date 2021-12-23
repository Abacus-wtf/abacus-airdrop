import { useCallback } from "react"
import { BigNumber } from "ethers"
import { TransactionResponse } from "@ethersproject/providers"
import { getContract } from "@config/utils"
import { ABC_PRICING_SESSION_ADDRESS } from "@config/constants"
import ABC_PRICING_SESSION_ABI from "@config/contracts/ABC_PRICING_SESSION_ABI.json"
import { useActiveWeb3React, useGeneralizedContractCall } from "@hooks/index"
import { useGetCurrentNetwork } from "@state/application/hooks"

export const useOnEarn = () => {
  const { account, library } = useActiveWeb3React()
  const { generalizedContractCall, isPending } = useGeneralizedContractCall()
  const networkSymbol = useGetCurrentNetwork()

  const onEarn = useCallback(async () => {
    let estimate
    let method: (...args: any) => Promise<TransactionResponse>
    let args: Array<BigNumber | number | string>
    let value: BigNumber | null

    const pricingSessionContract = getContract(
      ABC_PRICING_SESSION_ADDRESS(networkSymbol),
      ABC_PRICING_SESSION_ABI,
      library,
      account
    )

    method = pricingSessionContract.claimProfitsEarned
    estimate = pricingSessionContract.estimateGas.claimProfitsEarned
    args = []
    value = null

    const txnCb = async (response: any) => {
      console.log(response)
    }
    await generalizedContractCall({
      method,
      estimate,
      args,
      value,
      cb: txnCb,
    })
  }, [networkSymbol, library, account, generalizedContractCall])
  return {
    onEarn,
    isPending,
  }
}
