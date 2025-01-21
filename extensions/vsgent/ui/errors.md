error TS2688: Cannot find type definition file for '@shared'.
  The file is in the program because:
    Entry point of type library '@shared' specified in compilerOptions
src/components/ChatRow.tsx(9,12): error TS4033: Property 'message' of exported interface has or is using private name 'VsGentMessage'.

src/components/ChatView.tsx(10,13): error TS4033: Property 'messages' of exported interface has or is using private name 'VsGentMessage'.

src/components/utilities/combineApiRequests.ts(7,46): error TS4078: Parameter 'messages' of exported function has or is using private name 'VsGentMessage'.

src/components/utilities/combineApiRequests.ts(7,64): error TS4060: Return type of exported function has or is using private name 'VsGentMessage'.

src/components/utilities/combineCommandSequences.ts(7,51): error TS4078: Parameter 'messages' of exported function has or is using private name 'VsGentMessage'.

src/components/utilities/combineCommandSequences.ts(7,69): error TS4060: Return type of exported function has or is using private name 'VsGentMessage'.

src/components/utilities/getApiMetrics.ts(7,41): error TS4078: Parameter 'messages' of exported function has or is using private name 'VsGentMessage'.

src/components/utilities/getApiMetrics.ts(7,59): error TS4060: Return type of exported function has or is using private name 'ApiMetrics'.
