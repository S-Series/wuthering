import { HOME_POST_0_8 } from "./homePosts/0.8";
import { HOME_POST_0_9 } from "./homePosts/0.9";
import { HOME_POST_0_9_1 } from "./homePosts/0.9.1";
import { HOME_POST_0_9_2 } from "./homePosts/0.9.2";
import { HOME_POST_0_9_3 } from "./homePosts/0.9.3";
import { HOME_POST_1_0_0 } from "./homePosts/1.0.0";
import { HOME_POST_1_0_1 } from "./homePosts/1.0.1";
import { HOME_POST_1_0_2 } from "./homePosts/1.0.2";
import { HOME_POST_1_1_0 } from "./homePosts/1.1.0";
import { HOME_POST_1_2_0 } from "./homePosts/1.2.0";
import { HOME_POST_PRELAUNCH } from "./homePosts/prelaunch";
import type { HomePost } from "./homePosts/types";

export type { HomePost, LocaleReactNode } from "./homePosts/types";

export const HOME_POSTS: HomePost[] = [
  HOME_POST_1_2_0,
  HOME_POST_1_1_0,
  HOME_POST_1_0_2,
  HOME_POST_1_0_1,
  HOME_POST_1_0_0,
  HOME_POST_0_9_3,
  HOME_POST_0_9_2,
  HOME_POST_0_9_1,
  HOME_POST_0_9,
  HOME_POST_0_8,
  HOME_POST_PRELAUNCH,
];
