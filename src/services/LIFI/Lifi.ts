import { JsonRpcSigner } from '@ethersproject/providers'
import { Execution, Route, RoutesRequest, RoutesResponse, Step } from '@lifinance/types'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import { Signer } from 'ethers'
import { ParaswapExecutionManager } from './services/paraswap.execute'
import { OneInchExecutionManager } from './services/1inch.execute'
import { UniswapExecutionManager } from './services/uniswaps.execute'

import { isRoutesRequest } from './typeguards'

class LIFI {
  getRoutes = async (routesRequest: RoutesRequest): Promise<RoutesResponse> => {
    if (!isRoutesRequest(routesRequest)) {
      throw Error('Invalid routes request')
    }

    const result = await axios.post<RoutesResponse>(
      process.env.REACT_APP_API_URL + 'routes',
      routesRequest,
    )

    return result.data
  }

  // original parameters Signer, Route
  executeRoute = (signer: Signer, route: Route) /*:Promise<Step[]>*/ => {}

  // private triggerSwap = async (signer: JsonRpcSigner, step: Step, previousStep?: Step) => {
  //   const fromAddress = signer._address
  //   const toAddress = fromAddress

  //   // get right amount
  //   let fromAmount: BigNumber
  //   if (previousStep && previousStep.execution && previousStep.execution.toAmount) {
  //     fromAmount = new BigNumber(previousStep.execution.toAmount)
  //   } else {
  //     fromAmount = new BigNumber(step.action.fromAmount)
  //   }
  //   let executionManager
  //   // ensure chain is set
  //   switch (step.tool) {
  //     case 'paraswap':
  //       executionManager = new ParaswapExecutionManager()
  //       break
  //     case '1inch':
  //       executionManager = new OneInchExecutionManager()
  //       break
  //     default:
  //       executionManager = new UniswapExecutionManager()
  //   }

  //   return await executionManager.executeSwap(
  //     signer,
  //     step.action,
  //     step.estimate,
  //     fromAmount,
  //     fromAddress,
  //     toAddress,
  //     (status: Execution) => updateStatus(step, status),
  //     step.execution,
  //   )
  // }

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
