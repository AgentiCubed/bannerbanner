import { llm, llmPrompt } from './llm';
import { fetchUser } from './user';
declare global {
    interface Window {
        spark: {
            llmPrompt: typeof llmPrompt;
            /**
             * @deprecated `spark.llm` is deprecated and will be removed. It is backed by
             * the GitHub Models service, which is being fully retired on July 30, 2026,
             * so calls will stop working. Do not use it in new code and migrate existing
             * usage away from it. See
             * https://github.blog/changelog/2026-07-01-github-models-is-being-fully-retired-on-july-30-2026/
             */
            llm: typeof llm;
            user: typeof fetchUser;
            kv: typeof kv;
        };
    }
}
declare const kv: {
    keys: () => Promise<string[]>;
    get: <T>(key: string) => Promise<T | undefined>;
    set: <T>(key: string, value: T) => Promise<void>;
    delete: (key: string) => Promise<void>;
};
export {};
