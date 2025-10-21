"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Bot, Database, ExternalLink, Loader2, Send, User } from "lucide-react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Navigation } from "~~/components/navigation";
import { Address } from "~~/components/scaffold-eth";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import { ScrollArea } from "~~/components/ui/scroll-area";
import { Textarea } from "~~/components/ui/textarea";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  type?: "log" | "result" | "blockchain" | "error";
  blockchainData?: {
    transaction_hash: string;
    research_id: number;
    gas_used: number;
    block_number: number;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function GeneAnalysisPage() {
  const { address, isConnected } = useAccount();
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sessionError, setSessionError] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // 세션 생성
  const createSession = useCallback(async () => {
    if (isConnecting) return; // 이미 연결 중이면 중복 실행 방지

    setIsConnecting(true);
    setSessionError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create session: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      setSessionId(data.session_id);
      setSessionError("");
      toast.success("세션이 생성되었습니다");
    } catch (error) {
      console.error("Session creation error:", error);

      let errorMessage = "";
      // 백엔드 서버 연결 실패 감지
      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage = "백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.";
        toast.error(errorMessage);
      } else {
        errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";
        toast.error(`세션 생성에 실패했습니다: ${errorMessage}`);
      }

      setSessionError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting]);

  // 페이지 로드 시 세션 생성
  useEffect(() => {
    if (isConnected && !sessionId) {
      createSession();
    }
  }, [isConnected, sessionId, createSession]);

  // 메시지 전송
  const sendMessage = async () => {
    if (!inputMessage.trim() || !sessionId || !address) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: inputMessage,
          user_address: address,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;

          const eventMatch = line.match(/^event: (.+)$/m);
          const dataMatch = line.match(/^data: (.+)$/m);

          if (eventMatch && dataMatch) {
            const eventType = eventMatch[1];
            const data = JSON.parse(dataMatch[1]);

            if (eventType === "message") {
              const assistantMessage: Message = {
                role: "assistant",
                content: data.content,
                timestamp: new Date(data.timestamp),
                type: data.type,
              };
              setMessages(prev => [...prev, assistantMessage]);
            } else if (eventType === "storing") {
              const systemMessage: Message = {
                role: "system",
                content: "블록체인에 연구 결과를 저장하는 중...",
                timestamp: new Date(),
              };
              setMessages(prev => [...prev, systemMessage]);
            } else if (eventType === "blockchain") {
              const blockchainMessage: Message = {
                role: "system",
                content: "블록체인에 연구 결과가 저장되었습니다",
                timestamp: new Date(),
                type: "blockchain",
                blockchainData: data,
              };
              setMessages(prev => [...prev, blockchainMessage]);
              toast.success("연구 결과가 블록체인에 저장되었습니다");
            } else if (eventType === "done") {
              setIsLoading(false);
            } else if (eventType === "error" || eventType === "blockchain_error") {
              const errorMessage: Message = {
                role: "system",
                content: data.error || "오류가 발생했습니다",
                timestamp: new Date(),
                type: "error",
              };
              setMessages(prev => [...prev, errorMessage]);
              toast.error(data.error || "오류가 발생했습니다");
            }
          }
        }
      }
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("메시지 전송에 실패했습니다");
      const errorMessage: Message = {
        role: "system",
        content: "메시지 전송 중 오류가 발생했습니다",
        timestamp: new Date(),
        type: "error",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 자동 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 엔터키로 전송
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold">Gene Analysis AI Agent</h1>
            <p className="text-muted-foreground text-lg">Biomni AI 기반 유전자 분석 채팅 인터페이스</p>
          </div>

          {/* Wallet Info */}
          {isConnected && address && (
            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="py-3 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">연결된 지갑:</span>
                  <Address address={address} />
                </div>
                {sessionId && (
                  <Badge variant="outline" className="font-mono text-xs">
                    세션: {sessionId.slice(0, 8)}...
                  </Badge>
                )}
              </CardContent>
            </Card>
          )}

          {/* Chat Interface */}
          <Card className="border-white/10 bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-accent" />
                채팅
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {!isConnected ? (
                <div className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">지갑을 연결해주세요</h3>
                  <p className="text-sm text-muted-foreground">
                    Gene Analysis AI Agent를 사용하려면 먼저 지갑을 연결해야 합니다.
                  </p>
                </div>
              ) : isConnecting ? (
                <div className="p-12 text-center">
                  <Loader2 className="h-12 w-12 mx-auto mb-4 text-accent animate-spin" />
                  <h3 className="text-lg font-semibold mb-2">세션 생성 중...</h3>
                  <p className="text-sm text-muted-foreground">잠시만 기다려주세요.</p>
                </div>
              ) : sessionError ? (
                <div className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                  <h3 className="text-lg font-semibold mb-2">세션 생성 실패</h3>
                  <p className="text-sm text-muted-foreground mb-4">{sessionError}</p>
                  <Button onClick={createSession} variant="outline">
                    다시 시도
                  </Button>
                </div>
              ) : (
                <>
                  {/* Messages */}
                  <ScrollArea className="h-[500px] px-4">
                    <div className="space-y-4 py-4">
                      {messages.length === 0 && (
                        <div className="text-center py-12">
                          <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            유전자 분석에 대해 질문해보세요.
                            <br />
                            예: &quot;BRCA1 유전자의 기능을 설명해주세요&quot;
                          </p>
                        </div>
                      )}

                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {message.role === "assistant" && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                              <Bot className="h-4 w-4 text-accent" />
                            </div>
                          )}

                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.role === "user"
                                ? "bg-accent text-background"
                                : message.type === "error"
                                  ? "bg-destructive/20 border border-destructive/50"
                                  : message.type === "blockchain"
                                    ? "bg-accent/10 border border-accent/50"
                                    : "bg-muted"
                            }`}
                          >
                            {message.type === "blockchain" && message.blockchainData ? (
                              <div className="space-y-2">
                                <p className="font-medium text-sm flex items-center gap-2">
                                  <Database className="h-4 w-4" />
                                  {message.content}
                                </p>
                                <div className="text-xs space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">트랜잭션:</span>
                                    <code className="font-mono">
                                      {message.blockchainData.transaction_hash.slice(0, 10)}...
                                    </code>
                                    <a
                                      href={`https://sepolia.basescan.org/tx/${message.blockchainData.transaction_hash}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-accent hover:underline inline-flex items-center gap-1"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      탐색기에서 보기
                                    </a>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">연구 ID: </span>
                                    {message.blockchainData.research_id}
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">블록 번호: </span>
                                    {message.blockchainData.block_number}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {message.timestamp.toLocaleTimeString("ko-KR")}
                            </p>
                          </div>

                          {message.role === "user" && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                              <User className="h-4 w-4 text-background" />
                            </div>
                          )}
                        </div>
                      ))}

                      {isLoading && (
                        <div className="flex gap-3 justify-start">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-accent" />
                          </div>
                          <div className="bg-muted rounded-lg p-3">
                            <Loader2 className="h-4 w-4 animate-spin text-accent" />
                          </div>
                        </div>
                      )}

                      <div ref={scrollRef} />
                    </div>
                  </ScrollArea>

                  {/* Input */}
                  <div className="border-t border-white/10 p-4">
                    <div className="flex gap-2">
                      <Textarea
                        value={inputMessage}
                        onChange={e => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="유전자 분석에 대해 질문하세요... (Shift+Enter로 줄바꿈)"
                        className="min-h-[60px] resize-none"
                        disabled={isLoading}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={isLoading || !inputMessage.trim()}
                        className="bg-accent text-background hover:bg-accent/90 px-6"
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
