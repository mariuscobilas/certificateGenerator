'use client'

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
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
import { getCertificate, getCsv } from "@/api/upload";

interface TextBox {
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: string;
    fontFamily: string;
    fontWeight: string;
    column: string;
}

export default function CertificatePage() {
    const [currentFont, setCurrentFont] = useState<string>("font-inter-sans");
    const [currentWeight, setCurrentWeight] = useState<string>();
    const [currentFontSize, setCurrentFontSize] = useState<string>("14");
    const [appliedFontSize, setAppliedFontSize] = useState<string>("14");
    const [availableWeights, setAvailableWeights] = useState<string[]>([]);
    const [csvFile, setCsvFile] = useState<string>();
    const [certificateFile, setCertificateFile] = useState<string>();
    const [dataColumns, setDataColumns] = useState<string[]>([]);
    const [currentColumn, setCurrentColumn] = useState<string>();
    const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
    const [pdfUrl, setPdfUrl] = useState<string>("");
    const [draggedBox, setDraggedBox] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const csvListResponse = await getCsv();
                const certListResponse = await getCertificate();

                if (!csvListResponse.success || !csvListResponse.files?.length) {
                    console.error('No CSV files found');
                    return;
                }
                if (!certListResponse.success || !certListResponse.files?.length) {
                    console.error('No certificate files found');
                    return;
                }

                const csvFilename = csvListResponse.files[0];
                const certFilename = certListResponse.files[0];

                const csvResponse = await fetch(`http://localhost:3001/uploads/csv/${csvFilename}`);
                if (!csvResponse.ok) throw new Error('Failed to fetch CSV');
                const csvText = await csvResponse.text();

                const csvLines = csvText.trim().split("\n");
                const headers = csvLines[0].split(",").map((col) => col.trim());

                setDataColumns(headers);
                setCsvFile(csvText);
                setCertificateFile(certFilename);
                setPdfUrl(`http://localhost:3001/uploads/certificate/${certFilename}`);

                console.log("Loaded CSV columns:", headers);
                console.log("Loaded certificate filename:", certFilename);
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

    const canContinue = textBoxes.length > 0;

    function onFontValueChange(fontName: string) {
        setCurrentFont(fontName);
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
        const font = FONT_OPTIONS.find((option: any) => option.className === fontName);
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
    }

    function onColumnValueChange(column: string) {
        setCurrentColumn(column);
    }

    function addTextField() {
        if (!currentColumn || !currentWeight) return;

        const newBox: TextBox = {
            id: Date.now().toString(),
            text: currentColumn,
            x: 100,
            y: 100,
            fontSize: appliedFontSize,
            fontFamily: currentFont,
            fontWeight: currentWeight,
            column: currentColumn
        };

        setTextBoxes([...textBoxes, newBox]);
    }
    function handleMouseDown(e: React.MouseEvent, boxId: string) {
        const box = textBoxes.find(b => b.id === boxId);
        // Make sure containerRef.current exists
        if (!box || !containerRef.current) return;

        // 1. Get the container's position
        const rect = containerRef.current.getBoundingClientRect();

        // 2. Calculate mouse position *relative to the container*
        const mouseXInContainer = e.clientX - rect.left;
        const mouseYInContainer = e.clientY - rect.top;

        setDraggedBox(boxId);

        // 3. Calculate the offset using the correct container-relative coordinates
        setDragOffset({
            x: mouseXInContainer - box.x,
            y: mouseYInContainer - box.y
        });
    }

// Your handleMouseMove function is correct and does not need changes.
    function handleMouseMove(e: React.MouseEvent) {
        if (!draggedBox || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - dragOffset.x;
        const y = e.clientY - rect.top - dragOffset.y;

        setTextBoxes(boxes =>
            boxes.map(box =>
                box.id === draggedBox
                    ? { ...box, x: Math.max(0, x), y: Math.max(0, y) }
                    : box
            )
        );
    }

// Your handleMouseUp function is correct and does not need changes.
    function handleMouseUp() {
        setDraggedBox(null);
    }

    function removeTextField(boxId: string) {
        setTextBoxes(boxes => boxes.filter(box => box.id !== boxId));
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

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-gray-100 font-sans">
            <div className="relative flex flex-col items-center p-10 gap-10 max-w-[1000px] w-full max-h-[675px] h-full bg-white rounded-2xl">
                <div className="relative h-fit w-full max-w-full flex flex-col gap-10 justify-center items-center">
                    <div className="w-full items-center justify-center flex flex-col flex-wrap gap-3">
                        <p className="text-lg font-medium text-primary">2. Create fields</p>
                        <Progress className="w-[414px] h-4" value={50} />
                    </div>

                    <div className="flex items-center justify-center w-full h-fit gap-6">
                        {/* PDF Viewer with Draggable Text */}
                        <div
                            ref={containerRef}
                            className="relative w-[500px] h-[400px] bg-secondary rounded-lg overflow-auto"
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            {pdfUrl ? (
                                <iframe
                                    src={pdfUrl}
                                    className="w-full h-full border-0"
                                    title="Certificate Preview"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                                    Loading certificate...
                                </div>
                            )}

                            {/* Draggable Text Boxes */}
                            {textBoxes.map((box) => (
                                <div
                                    key={box.id}
                                    className={`absolute cursor-move bg-white/80 px-2 py-1 rounded border-2 border-primary ${box.fontFamily}`}
                                    style={{
                                        left: `${box.x}px`,
                                        top: `${box.y}px`,
                                        fontSize: `${box.fontSize}px`,
                                        fontWeight: box.fontWeight,
                                        userSelect: 'none'
                                    }}
                                    onMouseDown={(e) => handleMouseDown(e, box.id)}
                                >
                                    <button
                                        className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-white rounded-full text-xs flex items-center justify-center hover:bg-destructive/80"
                                        onClick={() => removeTextField(box.id)}
                                    >
                                        ×
                                    </button>
                                    {box.text}
                                </div>
                            ))}
                        </div>

                        {/* Configuration Panel */}
                        <div className="flex flex-col gap-2 w-fit h-full">
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

                            <Select value={currentWeight} onValueChange={onWeightValueChange}>
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

                            <Select value={currentColumn} onValueChange={onColumnValueChange}>
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

                            <Button
                                onClick={addTextField}
                                disabled={!currentColumn || !currentWeight}
                                className="w-[180px]"
                            >
                                Add Field
                            </Button>
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
                                Please add at least one field
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}