"use client"

import { useParams } from "next/navigation"
import { api } from "../../../convex/_generated/api"
import { useQuery } from "convex/react"
import { Id } from "../../../convex/_generated/dataModel"
import { use } from "react"
import Loader from "../loader"

export default function Form() {
    const params = useParams()
    const registrationId = params.id as Id<"registrations">;

    const userDetails = useQuery(api.registration.getRegistration, { registrationId });
    console.log(userDetails);

    if (!userDetails) {
        return <Loader />
    }

    return <div>{registrationId}</div>
}