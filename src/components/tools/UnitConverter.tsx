import { useState, useEffect } from "react";
import { ArrowLeftRight, Scale, Ruler, Clock, HardDrive } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const UnitConverter = () => {
  const [category, setCategory] = useState("bytes");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [inputValue, setInputValue] = useState("1024");
  const [outputValue, setOutputValue] = useState("");

  const units: Record<string, Record<string, number>> = {
    bytes: {
      Bytes: 1,
      "Kilobytes (KB)": 1024,
      "Megabytes (MB)": 1024 ** 2,
      "Gigabytes (GB)": 1024 ** 3,
      "Terabytes (TB)": 1024 ** 4,
    },
    time: {
      Seconds: 1,
      Minutes: 60,
      Hours: 3600,
      Days: 86400,
      Weeks: 604800,
    },
    length: {
      Meters: 1,
      Kilometers: 1000,
      Centimeters: 0.01,
      Millimeters: 0.001,
      Miles: 1609.34,
      Yards: 0.9144,
      Feet: 0.3048,
      Inches: 0.0254,
    },
    mass: {
      Grams: 1,
      Kilograms: 1000,
      Milligrams: 0.001,
      Pounds: 453.592,
      Ounces: 28.3495,
    },
  };

  useEffect(() => {
    const categoryUnits = Object.keys(units[category]);
    setFromUnit(categoryUnits[0]);
    setToUnit(categoryUnits[1] || categoryUnits[0]);
  }, [category]);

  useEffect(() => {
    convert();
  }, [inputValue, fromUnit, toUnit, category]);

  const convert = () => {
    const input = parseFloat(inputValue);
    if (isNaN(input) || inputValue === "") {
      setOutputValue("");
      return;
    }

    const fromFactor = units[category][fromUnit];
    const toFactor = units[category][toUnit];

    if (fromFactor === undefined || toFactor === undefined) return;

    const result = (input * fromFactor) / toFactor;
    setOutputValue(
      result.toLocaleString(undefined, {
        maximumFractionDigits: 10,
        useGrouping: true,
      })
    );
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "bytes":
        return <HardDrive className="mr-2 h-4 w-4" />;
      case "time":
        return <Clock className="mr-2 h-4 w-4" />;
      case "length":
        return <Ruler className="mr-2 h-4 w-4" />;
      case "mass":
        return <Scale className="mr-2 h-4 w-4" />;
      default:
        return <ArrowLeftRight className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Unit Converter
        </h1>
        <p className="text-muted-foreground">
          Convert between common units of measurement.
        </p>
      </div>

      {/* Category Selector */}
      <Card className="w-full md:w-1/2 mx-auto">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label htmlFor="unitCategory">Conversion Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="unitCategory">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bytes">Bytes</SelectItem>
                <SelectItem value="time">Time</SelectItem>
                <SelectItem value="length">Length</SelectItem>
                <SelectItem value="mass">Mass</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FROM */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              {getCategoryIcon(category)} From
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger>
                <SelectValue placeholder="From Unit" />
              </SelectTrigger>
              <SelectContent max-h="200px">
                {Object.keys(units[category]).map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="text-2xl h-16"
              placeholder="Enter value"
            />
          </CardContent>
        </Card>

        {/* TO */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              {getCategoryIcon(category)} To
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger>
                <SelectValue placeholder="To Unit" />
              </SelectTrigger>
              <SelectContent max-h="200px">
                {Object.keys(units[category]).map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={outputValue}
              readOnly
              className="text-2xl h-16 bg-muted text-primary font-bold border-none"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnitConverter;
