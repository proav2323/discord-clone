"use client"

import { useEffect, useState } from "react"
import { CREATEserverModel } from "../models/create-server-model"
import { InviteModel } from "../models/inviteModel";
import { EditServerModel } from "../models/editSever";
import { MembersModel } from "../models/MembersModel";

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
        </>
    )
}