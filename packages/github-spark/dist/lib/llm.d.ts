/**
 * @deprecated `spark.llm` is deprecated and will be removed. It is backed by the
 * GitHub Models service, which is being fully retired on July 30, 2026, so calls
 * to this function will stop working. Do not use it in new code and migrate
 * existing usage away from it. See
 * https://github.blog/changelog/2026-07-01-github-models-is-being-fully-retired-on-july-30-2026/
 */
export declare function llm(prompt: string, modelName?: string, jsonMode?: boolean): Promise<string>;
export declare function llmPrompt(strings: string[], ...values: any[]): string;
