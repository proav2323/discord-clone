"use client"

import { useEffect, useState } from "react"
import { CREATEserverModel } from "../models/create-server-model"
import { InviteModel } from "../models/inviteModel";
import { EditServerModel } from "../models/editSever";
import { MembersModel } from "../models/MembersModel";
import { CreateChannelModel } from "../models/createChannel";
import { LeaveServerModel } from "../models/LeaveServer";
import { DeleteServerModel } from "../models/DeleteServer";
import { DeleteChannelModel } from "../models/deleteChannel";
import { EditChannelModel } from "../models/editChannel";
import { MessageAttch } from "../models/messageAttch";
import { DeleteMessageModel } from "../models/deletMessage";

export const ModelProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true)
    }, [])
    if (!isMounted) {
        return null;
    }
    return (
        <>
        <CREATEserverModel />
        <InviteModel />
        <EditServerModel />
        <MembersModel />
        <CreateChannelModel />
        <LeaveServerModel />
        <DeleteServerModel />
        <DeleteChannelModel />
        <EditChannelModel />
        <MessageAttch />
        <DeleteMessageModel />
        </>
    )
}