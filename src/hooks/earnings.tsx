import { useCallback } from "react"
import { BigNumber } from "ethers"
import { TransactionResponse } from "@ethersproject/providers"
import { getContract } from "@config/utils"
import { ARB_ABC_PRESALE } from "@config/constants"
import ABC_PRESALE_ABI from "@config/contracts/ABC_PRESALE_ABI.json"
import { useActiveWeb3React, useGeneralizedContractCall } from "@hooks/index"
import { parseEther } from "ethers/lib/utils"

export const useOnEarn = () => {
  const { account, library } = useActiveWeb3React()
  const { generalizedContractCall, isPending } = useGeneralizedContractCall()

  const onEarn = useCallback(
    async (amount: string) => {
      let estimate
      let method: (...args: any) => Promise<TransactionResponse>
      let args: Array<BigNumber | number | string>
      let value: BigNumber | null

      const presaleContract = getContract(
        ARB_ABC_PRESALE,
        ABC_PRESALE_ABI,
        library,
        account
      )

      method = presaleContract.claimProfitRetroactive
      estimate = presaleContract.estimateGas.claimProfitRetroactive
      args = [parseEther(amount)]
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
    },
    [library, account, generalizedContractCall]
  )
  return {
    onEarn,
    isPending,
  }
}
