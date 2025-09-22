"use client";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function FileDisplay({ storageId }) {
    const fileUrl = useQuery(api.registration.getFileUrl, { storageId });

    if (!fileUrl) return <div>Loading file...</div>;

    return (
        <div>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                Open File
            </a>
        </div>
    );
}
