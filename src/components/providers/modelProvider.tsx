"use client"

import { useEffect, useState } from "react"
import { CREATEserverModel } from "../models/create-server-model"
import { InviteModel } from "../models/inviteModel";

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
        </>
    )
}