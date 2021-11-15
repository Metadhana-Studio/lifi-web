import { JsonRpcSigner } from '@ethersproject/providers'
import {
  DepositAction,
  Step,
  Route,
  WithdrawAction,
  CrossAction,
  SwapAction,
  SwapEstimate,
  Execution,
} from '@lifinance/types'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import { Signer } from 'ethers'
import { UniswapExecutionManager } from './services/uniswaps.execute'

import { isDeposit, isWithdraw } from './typeguards'

class LIFI {
  findRoutes = async (deposit: DepositAction, withdraw: WithdrawAction): Promise<Step[][]> => {
    if (!isDeposit(deposit)) {
      throw Error('Invalid Deposit Type')
    }
    if (!isWithdraw(withdraw)) {
      throw Error('Invalid Withdraw Type')
    }
    const result = await axios.post<Step[][]>(process.env.REACT_APP_API_URL + 'transfer', {
      deposit,
      withdraw,
    })
    return result.data
  }

  // original parameters Signer, Route
  executeRoute = (signer: Signer, route: Route) /*:Promise<Step[]>*/ => {
    for (const step of route.steps) {
    }
  }

  private triggerSwap = async (signer: JsonRpcSigner, step: Step, previousStep?: Step) => {
    const swapAction = step.action as SwapAction
    const swapEstimate = step.estimate as SwapEstimate
    const swapExecution = step.execution as Execution
    const fromAddress = signer._address
    const toAddress = fromAddress

    // get right amount
    let fromAmount: BigNumber
    if (previousStep && previousStep.execution && previousStep.execution.toAmount) {
      fromAmount = new BigNumber(previousStep.execution.toAmount)
    } else {
      fromAmount = new BigNumber(swapAction.amount)
    }
    let executionManager
    // ensure chain is set
    switch (swapAction.tool) {
      case 'paraswap':

      case '1inch':

      default:
        executionManager = new UniswapExecutionManager()
    }

    return await executionManager.executeSwap(
      signer,
      swapAction,
      swapEstimate,
      fromAmount,
      fromAddress,
      toAddress,
      (status: Execution) => updateStatus(step, status),
      swapExecution,
    )
  }

  // getCurrentStatus = (route: Route): Route => {

  // }

  // registerCallback = (callback: (updatedRoute: Route) => void, route?: Route): void => {

  // }

  // deregisterCallback = (callback: (updateRoute: Route) => void, route?: Route): void => {

  // }

  // getActiveExecutions = (): Route[] => {

  // }
}

export default new LIFI()
