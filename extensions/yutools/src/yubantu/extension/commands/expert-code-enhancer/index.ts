import {
  createModelProvider,
  getCurrentSessionIdHistoriesMap
} from '../../ai/helpers'
import { createTmpFileInfo } from '../../file-utils/create-tmp-file'
import { showContinueMessage } from '../../file-utils/show-continue-message'
import { tmpFileWriter } from '../../file-utils/tmp-file-writer'
import { t } from '../../i18n'
import { getCurrentWorkspaceFolderEditor } from '../../utils'
import type { RunnableConfig } from '@langchain/core/runnables'
import * as vscode from 'vscode'

import { buildGeneratePrompt } from './build-generate-prompt'

export const cleanupExpertCodeEnhancerRunnables = async () => {
  const openDocumentPaths = new Set(
    vscode.workspace.textDocuments.map(doc => doc.uri.fsPath)
  )
  const sessionIdHistoriesMap = await getCurrentSessionIdHistoriesMap()

  Object.keys(sessionIdHistoriesMap).forEach(sessionId => {
    const path = sessionId.match(/^expertCodeEnhancer:(.*)$/)?.[1]

    if (path && !openDocumentPaths.has(path)) {
      delete sessionIdHistoriesMap[sessionId]
    }
  })
}

export const handleExpertCodeEnhancer = async () => {
  const { workspaceFolder } = await getCurrentWorkspaceFolderEditor()
  const {
    originalFileExt,
    originalFileContent,
    originalFileLanguageId,
    originalFileUri,
    originalFileContentIsFromSelection,
    tmpFileUri,
    isTmpFileHasContent
  } = await createTmpFileInfo()

  // ai
  const modelProvider = await createModelProvider()
  const aiRunnableAbortController = new AbortController()
  const aiRunnable = await modelProvider.createRunnable({
    signal: aiRunnableAbortController.signal
  })
  const sessionId = `expertCodeEnhancer:${tmpFileUri.fsPath}}`
  const aiRunnableConfig: RunnableConfig = {
    configurable: {
      sessionId
    }
  }
  const sessionIdHistoriesMap = await getCurrentSessionIdHistoriesMap()
  const isSessionHistoryExists = !!sessionIdHistoriesMap[sessionId]
  const isContinue = isTmpFileHasContent && isSessionHistoryExists

  const prompt = await buildGeneratePrompt({
    workspaceFolder,
    currentFilePath: originalFileUri.fsPath,
    code: originalFileContent,
    codeIsFromSelection: originalFileContentIsFromSelection,
    abortController: aiRunnableAbortController
  })

  const tmpFileWriterReturns = await tmpFileWriter({
    ext: originalFileExt,
    languageId: originalFileLanguageId,
    onCancel() {
      aiRunnableAbortController.abort()
    },
    buildAiStream: async () => {
      if (!isContinue) {
        // cleanup previous session
        delete sessionIdHistoriesMap[sessionId]

        const aiStream = aiRunnable.stream(
          {
            input: prompt
          },
          aiRunnableConfig
        )
        return aiStream
      }

      // continue
      return aiRunnable.stream(
        {
          input: `
        continue, please do not reply with any text other than the code, and do not use markdown syntax.
        go continue.
        `
        },
        aiRunnableConfig
      )
    }
  })

  await showContinueMessage({
    tmpFileUri: tmpFileWriterReturns?.tmpFileUri,
    originalFileContentLineCount: originalFileContent.split('\n').length,
    continueMessage: t('info.continueMessage') + t('info.iconContinueMessage'),
    onContinue: async () => {
      await handleExpertCodeEnhancer()
    }
  })
}
