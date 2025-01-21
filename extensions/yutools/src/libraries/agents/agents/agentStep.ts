export interface AgentStep {
  type: string;
  data: any;
}

export class ActionStep implements AgentStep {
  type: string = "action";
  constructor(public data: { toolName: string; arguments: any }) { }
}

export class PlanningStep implements AgentStep {
  type: string = "planning";
  constructor(public data: { plan: string[] }) { }
}

export class TaskStep implements AgentStep {
  type: string = "task";
  constructor(public data: { task: string }) { }
}

export class SystemPromptStep implements AgentStep {
  type: string = "system_prompt";
  constructor(public data: { prompt: string }) { }
}