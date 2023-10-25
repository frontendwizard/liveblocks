import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import { Point, Color, Layer } from "./src/types";

const client = createClient({
  throttle: 16,

  // authEndpoint: "/api/liveblocks-auth",
  authEndpoint: (_roomId: string) =>
    Promise.resolve({
      token:
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTgyNDI2ODksImV4cCI6MTY5ODI0NjI4OSwiayI6ImFjYyIsInBpZCI6IjYzNTc4ZWFlYzM4ODRlYjYxZWZkNjc1NSIsInVpZCI6InVzZXItNiIsInBlcm1zIjp7Im5leHRqcy13aGl0ZWJvYXJkLWFkdmFuY2VkIjpbInJvb206d3JpdGUiLCJjb21tZW50czp3cml0ZSJdfSwibWNwciI6MjB9.lt97pzb7xB3snpSeqixdLiqt3Lk2G3pFCsCMdQkLDW38x8WX_HaQYAGgNtAS_G-9MvJJirr-d6CnqvXfdei1Ngc6AoQWVFPu-ml5LqgnL160VYH78ZhDwGS1do6ICPR1bOeFzwblvIlfvPd-7k_9oFkPNGyi_0DVd41pq3pYozW_vT78Zt-LGVATP15umx1Ue5zJ19VbFVLFI244Z6bI8TGo6cTK4YwSlgkPy22bj5faZ0eSL04m57HFP_9-_0MyEbwXCuHDrtBHpOlxxZHw8bNfV6bgyzJ1KCZj9GKN-hzKb5ekL9IoFRwhPK3RH3gJChh7BuBD3zlyskTTDcIApQ",
    }),

  // @ts-expect-error Hidden config
  baseUrl: "http://localhost:3333/",
  enableDebugLogging: true,
});

// Presence represents the properties that will exist on every User in the Room
// and that will automatically be kept in sync. Accessible through the
// `user.presence` property. Must be JSON-serializable.
type Presence = {
  selection: string[];
  cursor: Point | null;
  pencilDraft: [x: number, y: number, pressure: number][] | null;
  penColor: Color | null;
};

// Storage represents the shared document that persists in the Room, even after
// all Users leave. Fields under Storage typically are LiveList, LiveMap,
// LiveObject instances, for which updates are automatically persisted and
// synced to all connected clients.
type Storage = {
  layers: LiveMap<string, LiveObject<Layer>>;
  layerIds: LiveList<string>;
};

// Optionally, UserMeta represents static/readonly metadata on each User, as
// provided by your own custom auth backend (if used). Useful for data that
// will not change during a session, like a User's name or avatar.
// type UserMeta = {
//   id?: string,  // Accessible through `user.id`
//   info?: Json,  // Accessible through `user.info`
// };

// Optionally, the type of custom events broadcasted and listened for in this
// room. Must be JSON-serializable.
// type RoomEvent = {};

export const {
  suspense: {
    RoomProvider,
    useCanRedo,
    useCanUndo,
    useHistory,
    useMutation,
    useOthers,
    useOthersMapped,
    useOthersConnectionIds,
    useOther,
    useRoom,
    useSelf,
    useStorage,
    useUpdateMyPresence,
  },
} = createRoomContext<Presence, Storage /* UserMeta, RoomEvent */>(client);
