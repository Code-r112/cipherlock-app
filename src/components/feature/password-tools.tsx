"use client"

import { useState, useTransition, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generatePassword, type GeneratePasswordInput } from '@/ai/flows/generate-password-flow';
import { analyzePassword, type AnalyzePasswordOutput } from '@/ai/flows/analyze-password-flow';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Sparkles, Copy, Shield, ShieldAlert, ShieldCheck, ShieldClose } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const passwordGeneratorSchema = z.object({
  length: z.number().min(8).max(128).default(16),
  includeUppercase: z.boolean().default(true),
  includeNumbers: z.boolean().default(true),
  includeSymbols: z.boolean().default(true),
});

type PasswordGeneratorValues = z.infer<typeof passwordGeneratorSchema>;

const strengthIndicator = {
    'weak': { icon: ShieldAlert, color: 'text-red-500', text: 'Weak' },
    'medium': { icon: Shield, color: 'text-yellow-500', text: 'Medium' },
    'strong': { icon: ShieldCheck, color: 'text-green-500', text: 'Strong' },
    'very-strong': { icon: ShieldCheck, color: 'text-emerald-600', text: 'Very Strong' },
}

export function PasswordTools() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  // Generator state
  const [generatedPassword, setGeneratedPassword] = useState('');
  
  // Analyzer state
  const [passwordToAnalyze, setPasswordToAnalyze] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalyzePasswordOutput | null>(null);

  const generatorForm = useForm<PasswordGeneratorValues>({
    resolver: zodResolver(passwordGeneratorSchema),
    defaultValues: {
      length: 16,
      includeUppercase: true,
      includeNumbers: true,
      includeSymbols: true,
    },
  });
  
  const onSubmitGenerator = (values: PasswordGeneratorValues) => {
    startTransition(async () => {
      const password = await generatePassword(values);
      setGeneratedPassword(password);
    });
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
  };
  
  const analyze = useCallback(() => {
    if(!passwordToAnalyze) {
      setAnalysisResult(null);
      return;
    };
    startTransition(async () => {
       const result = await analyzePassword(passwordToAnalyze);
       setAnalysisResult(result);
    });
  }, [passwordToAnalyze])

  // Debounce analysis
  useEffect(() => {
      const handler = setTimeout(() => {
          analyze();
      }, 500);
      return () => clearTimeout(handler);
  }, [passwordToAnalyze, analyze]);

  const StrengthIcon = analysisResult ? strengthIndicator[analysisResult.strength].icon : ShieldClose;
  const strengthColor = analysisResult ? strengthIndicator[analysisResult.strength].color : 'text-muted-foreground';

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Password Generator</CardTitle>
          <CardDescription>Create a strong, secure password using AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...generatorForm}>
            <form onSubmit={generatorForm.handleSubmit(onSubmitGenerator)} className="space-y-6">
                <div className="space-y-2">
                    <Label>Generated Password</Label>
                    <div className="flex items-center space-x-2">
                        <Input readOnly value={generatedPassword} placeholder="Click 'Generate' to create a password" />
                        <Button type="button" variant="outline" size="icon" onClick={() => handleCopyToClipboard(generatedPassword)} disabled={!generatedPassword}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Options</AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                        <FormField
                            control={generatorForm.control}
                            name="length"
                            render={({ field }) => (
                            <FormItem>
                                <div className="flex justify-between items-center">
                                <FormLabel>Length</FormLabel>
                                <span className="text-sm font-medium">{field.value}</span>
                                </div>
                                <FormControl>
                                <Slider
                                    min={8}
                                    max={128}
                                    step={1}
                                    value={[field.value]}
                                    onValueChange={(vals) => field.onChange(vals[0])}
                                />
                                </FormControl>
                            </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={generatorForm.control}
                            name="includeUppercase"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="font-normal">Uppercase (A-Z)</FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={generatorForm.control}
                            name="includeNumbers"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="font-normal">Numbers (0-9)</FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={generatorForm.control}
                            name="includeSymbols"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="font-normal">Symbols (!@#$)</FormLabel>
                                </FormItem>
                            )}
                        />
                        </div>
                    </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Password Strength Analyzer</CardTitle>
          <CardDescription>Analyze the strength of your password with AI.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="password-analyzer">Your Password</Label>
                    <div className="relative">
                        <Input 
                          id="password-analyzer" 
                          type="text" 
                          value={passwordToAnalyze}
                          onChange={e => setPasswordToAnalyze(e.target.value)}
                          placeholder="Type a password to analyze"
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center">
                            {isPending ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : <StrengthIcon className={`h-5 w-5 ${strengthColor}`} />}
                        </div>
                    </div>
                </div>

                {analysisResult && (
                    <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                            Strength: <span className={`ml-2 font-bold ${strengthColor}`}>{strengthIndicator[analysisResult.strength].text}</span>
                        </h4>
                        {analysisResult.suggestions.length > 0 && (
                            <>
                                <h4 className="font-semibold mt-4 mb-2">Suggestions:</h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                    {analysisResult.suggestions.map((suggestion, index) => (
                                        <li key={index}>{suggestion}</li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
