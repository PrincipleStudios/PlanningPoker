import { useMemo, useEffect } from "react";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";

export function useSignalRConnection(hubRelativePath: string) {
    const isSSR = useMemo(() => typeof window === 'undefined', []);
    const connection = useMemo(() => isSSR ? null : new HubConnectionBuilder().withUrl(hubRelativePath).build(), [hubRelativePath, isSSR]);
    const connected = useMemo(() => connection?.start() ?? Promise.reject(), [connection]);

    useEffect(() => {
        return () => { connection?.stop() };
    }, [connection]);

    return [connection, connected] as [HubConnection, Promise<void>];
}
