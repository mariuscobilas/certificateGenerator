'use client'

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function UploadPage() {
    const [list, setList] = useState<File[]>();
    const [certificate, setCertificate] = useState<File[]>();
    const [listError, setListError] = useState<string | null>(null);
    const [certificateError, setCertificateError] = useState<string | null>(null);

    const validateFile = (file: File, type: 'csv' | 'pdf'): boolean => {
        if (type === 'csv') {
            const isValid = file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv');
            if (!isValid) {
                setListError('Please upload a CSV file');
            } else {
                setListError(null);
            }
            return isValid;
        } else if (type === 'pdf') {
            const isValid = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
            if (!isValid) {
                setCertificateError('Please upload a PDF file');
            } else {
                setCertificateError(null);
            }
            return isValid;
        }
        return false;
    };

    const handleDropList = (files: File[]) => {
        console.log(files);
        if (files.length > 0) {
            const file = files[0];
            if (validateFile(file, 'csv')) {
                setList(files);
                setListError(null); // Clear any previous errors
            }
        }
    };

    const handleDropCertificate = (files: File[]) => {
        console.log(files);
        if (files.length > 0) {
            const file = files[0];
            if (validateFile(file, 'pdf')) {
                setCertificate(files);
                setCertificateError(null); // Clear any previous errors
            }
        }
    };

    const handleErrorList = (error: Error) => {
        setListError(error.message);
    };

    const handleErrorCertificate = (error: Error) => {
        setCertificateError(error.message);
    };

    const canContinue = list && list.length > 0 && certificate && certificate.length > 0 && !listError && !certificateError;   
    // Debug logging
    console.log('Debug:', {
        list: list,
        certificate: certificate,
        listError,
        certificateError,
        canContinue
    });

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-gray-100 font-sans">
            <div className="relative flex flex-col items-center p-10 gap-10 max-w-[1000px] w-full max-h-[675px] h-full bg-white rounded-2xl">
                <div className="relative h-fit flex flex-col gap-10 justify-center items-center">
                    <div className="w-full items-center justify-center flex flex-col flex-wrap gap-3">
                        <p className="text-lg font-medium text-primary">1. Upload files</p>
                        <Progress className="w-[414px] h-4" value={25} />
                    </div>
                    
                    <div className="flex items-center justify-center w-full gap-6">
                        {/* CSV Upload */}
                        <div className="flex-1">
                            <Dropzone
                                onDrop={handleDropList}
                                onError={handleErrorList}
                                src={list}
                                className={cn(
                                    "w-[420px] h-[350px]",
                                    listError && "border-destructive"
                                )}
                                filetype="list"
                                accept={{
                                    '.csv file': ['.csv']
                                }}
                            >
                                <DropzoneEmptyState className="w-full h-full" />
                                <DropzoneContent />
                            </Dropzone>
                            {listError && (
                                <p className="text-xs text-destructive mt-2">{listError}</p>
                            )}
                        </div>

                        {/* PDF Upload */}
                        <div className="flex-1">
                            <Dropzone
                                onDrop={handleDropCertificate}
                                onError={handleErrorCertificate}
                                src={certificate}
                                className={cn(
                                    "w-[420px] h-[350px]",
                                    certificateError && "border-destructive"
                                )}
                                filetype="certificate"
                                accept={{
                                    '.pdf file': ['.pdf']
                                }}
                            >
                                <DropzoneEmptyState />
                                <DropzoneContent />
                            </Dropzone>
                            {certificateError && (
                                <p className="text-xs text-destructive mt-2">{certificateError}</p>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <Button variant="ghost" asChild>
                            <Link href="/" className="text-gray-600">Back</Link>
                        </Button>
                        {canContinue ? (
                            <Button variant="default" asChild>
                                <Link href="/certificate">Continue</Link>
                            </Button>
                        ) : (
                            <Button variant="default" disabled>
                                Continue
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}