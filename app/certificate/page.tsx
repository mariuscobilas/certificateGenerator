'use client'

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { useEffect, useState } from "react";
import textBox, { TextBoxProps } from "@/components/textBox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FONT_OPTIONS } from "@/app/utils/fonts";
import { createKey } from "next/dist/shared/lib/router/router";
import {getCertificate, getCsv} from "@/api/upload";

export default function CertificatePage() {
    const [currentFont, setCurrentFont] = useState<string>( "font-inter-sans");
    const [currentWeight, setCurrentWeight] = useState<string>();
    const [currentFontSize, setCurrentFontSize] = useState<string>("14");
    const [appliedFontSize, setAppliedFontSize] = useState<string>("14");
    const [availableWeights, setAvailableWeights] = useState<string[]>([]);
    const [csvFile, setCsvFile] = useState<File>();
    const [certificateFile, setCertificateFile] = useState<string>();
    const [dataColumns, setDataColumns] = useState([]);
    const [currentColumn, setCurrentColumn] = useState<string>();

    useEffect(() => {
        const loadData = async () => {
            try {
                const csv = await getCsv();
                const certificate = await getCertificate();

                const csvLines = csv.trim().split("\n");
                const headers = csvLines[0].split(",").map((col) => col.trim());

                setDataColumns(headers);
                setCsvFile(csv);
                setCertificateFile(certificate);

                console.log("Loaded CSV columns:", headers);
                console.log("Loaded certificate:", certificate);
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };

        loadData();
    }, []);



    const fontWeights = [
        { value: "100", label: "Thin" },
        { value: "200", label: "Extra Light" },
        { value: "300", label: "Light" },
        { value: "400", label: "Regular" },
        { value: "500", label: "Medium" },
        { value: "600", label: "Semi Bold" },
        { value: "700", label: "Bold" },
        { value: "800", label: "Extra Bold" },
        { value: "900", label: "Black" },
    ];

    let textBoxesNumber = 0;
    const canContinue = textBoxesNumber > 0;

    function onFontValueChange(fontName: string) {
        setCurrentFont(fontName);
        console.log("Selected Font Class:", fontName);

        const weights = loadWeights(fontName);
        if (weights && weights.length > 0) {
            setAvailableWeights(weights);
            setCurrentWeight(weights[0]);
        } else {
            setAvailableWeights([]);
            setCurrentWeight("");
        }
    }

    function loadWeights(fontName: string) {
        const font = FONT_OPTIONS.find(
            (option: any) => option.className === fontName
        );
        if (font && font.weights) {
            return font.weights;
        } else {
            console.error("Not found weights for font:", fontName);
            return [];
        }
    }

    function getWeightLabel(weight: string): string {
        return fontWeights.find((item) => item.value === weight)?.label || weight;
    }

    function onWeightValueChange(weightValue: string) {
        setCurrentWeight(weightValue);
        console.log("Selected Weight Value:", weightValue);
    }

    function onColumnValueChange(column: string) {
        setCurrentColumn(column);
        console.log("Selected Column:", column);
    }

    useEffect(() => {
        const weights = loadWeights(currentFont);
        if (weights && weights.length > 0) {
            setAvailableWeights(weights);
            setCurrentWeight(weights[0]);
        } else {
            setAvailableWeights([]);
            setCurrentWeight("");
        }

    }, []);

    // Handle side effects: whenever the applied font size changes
    useEffect(() => {
        console.log("Applied font size:", appliedFontSize);
        // you can apply font size to preview text here
    }, [appliedFontSize]);

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-gray-100 font-sans">
            <div className="relative flex flex-col items-center p-10 gap-10 max-w-[1000px] w-full max-h-[675px] h-full bg-white rounded-2xl">
                <div className="relative h-fit w-full max-w-full flex flex-col gap-10 justify-center items-center">
                    <div className="w-full items-center justify-center flex flex-col flex-wrap gap-3">
                        <p className="text-lg font-medium text-primary">2. Create fields</p>
                        <Progress className="w-[414px] h-4" value={50} />
                    </div>

                    <div className="flex items-center justify-center w-full h-fit gap-6">
                        <div className="w-full h-full bg-secondary flex items-center justify-center rounded-lg">
                            <p
                                key={`${currentFont}-${currentWeight}-${appliedFontSize}`}
                                className={`${currentFont} transition-all duration-200 max-w-full`}
                                style={{ fontSize: `${appliedFontSize}px`,
                                fontWeight: `${currentWeight}` }}
                            >
                                Sample Text
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 w-fit h-full stroke-2 stroke-accent">
                            {/* FONT SELECT */}
                            <Select value={currentFont} onValueChange={onFontValueChange}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Font" />
                                </SelectTrigger>
                                <SelectContent>
                                    {FONT_OPTIONS.map((fontOption: any) => (
                                        <SelectItem
                                            key={createKey()}
                                            value={fontOption.className}
                                        >
                                            {fontOption.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* WEIGHT SELECT */}
                            <Select value={currentWeight} onValueChange={onWeightValueChange} defaultValue={availableWeights[0]}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Weight" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableWeights.map((weightValue: string) => (
                                        <SelectItem key={createKey()} value={weightValue}>
                                            {getWeightLabel(weightValue)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* FONT SIZE INPUT */}
                            <Input
                                className="w-[180px]"
                                placeholder="Size"
                                value={currentFontSize}
                                onChange={(e) => setCurrentFontSize(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        setAppliedFontSize(currentFontSize);
                                    }
                                }}
                            />

                            {/* DATA COLUMN SELECT FROM LIST */}
                            <Select value={currentColumn} onValueChange={onColumnValueChange} defaultValue={dataColumns[0]}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select data" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dataColumns.map((dataColumn: string) => (
                                        <SelectItem key={createKey()} value={dataColumn}>
                                            {dataColumn}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>


                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="ghost" asChild>
                            <Link href="/" className="text-gray-600">Back</Link>
                        </Button>
                        {canContinue ? (
                            <Link
                                href="/email/configuration"

                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                            >
                                Continue
                            </Link>
                        ) : (
                            <Button variant="default" disabled>
                                {'Please configure the field'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
