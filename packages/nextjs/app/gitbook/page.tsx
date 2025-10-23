import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function GitBookPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                <span className="text-accent font-bold">📚</span>
              </div>
              <h1 className="text-4xl font-bold">BV_BNB DeSci Platform</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Science. On-Chain. Open to All.
            </p>
            <p className="text-lg text-muted-foreground">
              AI와 블록체인을 활용한 분산 과학 연구 플랫폼
            </p>
          </div>

          {/* Overview Section */}
          <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-accent">🌍</span>
                프로젝트 개요
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <strong>BV_BNB</strong>는 <strong>Biomni DeSci (Decentralized Science)</strong> 프로젝트로, 
                블록체인과 AI를 활용한 분산 과학 연구 플랫폼입니다. 
                <strong>Scaffold-ETH 2</strong> 프레임워크를 기반으로 구축되었으며, 
                <strong>Biomni AI 에이전트</strong>를 통한 바이오메디컬 연구와 
                <strong>Base Sepolia 블록체인</strong>을 통한 연구 결과의 영구 저장을 제공합니다.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-accent/20 text-accent">
                  DeSci Platform
                </Badge>
                <Badge variant="secondary" className="bg-accent/20 text-accent">
                  AI-Powered Research
                </Badge>
                <Badge variant="secondary" className="bg-accent/20 text-accent">
                  Blockchain Storage
                </Badge>
                <Badge variant="secondary" className="bg-accent/20 text-accent">
                  Open Science
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Architecture Section */}
          <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-accent">🏗️</span>
                시스템 아키텍처
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-white/10 bg-card/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-accent">💻</span>
                    <h3 className="font-semibold">Frontend</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Next.js 15.2.4 기반의 현대적인 웹 애플리케이션
                  </p>
                  <div className="mt-2 space-y-1">
                    <div className="text-xs text-muted-foreground">• React 19 + TypeScript</div>
                    <div className="text-xs text-muted-foreground">• Tailwind CSS + shadcn/ui</div>
                    <div className="text-xs text-muted-foreground">• Wagmi + Viem (Web3)</div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-white/10 bg-card/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-accent">🤖</span>
                    <h3 className="font-semibold">Backend</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    FastAPI 기반의 AI 에이전트 서비스
                  </p>
                  <div className="mt-2 space-y-1">
                    <div className="text-xs text-muted-foreground">• Biomni AI Agent</div>
                    <div className="text-xs text-muted-foreground">• Server-Sent Events</div>
                    <div className="text-xs text-muted-foreground">• Web3.py Integration</div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-white/10 bg-card/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-accent">⛓️</span>
                    <h3 className="font-semibold">Blockchain</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Base Sepolia 기반의 스마트 컨트랙트
                  </p>
                  <div className="mt-2 space-y-1">
                    <div className="text-xs text-muted-foreground">• ResearchRegistry.sol</div>
                    <div className="text-xs text-muted-foreground">• Permanent Storage</div>
                    <div className="text-xs text-muted-foreground">• Verifiable Timestamps</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technology Stack */}
          <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-accent">⚡</span>
                기술 스택
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-accent">Frontend Technologies</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-sm">Next.js 15.2.4 (App Router)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-sm">React 19 + TypeScript</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-sm">Tailwind CSS + DaisyUI</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-sm">Wagmi v2 + Viem</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-sm">Zustand + TanStack Query</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-accent">Backend & AI</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-sm">FastAPI (Python)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-sm">Biomni AI Agent (Stanford)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-sm">Server-Sent Events</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-sm">Web3.py (Blockchain)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-sm">Claude/GPT/Gemini Models</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Features */}
          <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-accent">🚀</span>
                주요 기능
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-accent">🧬</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">연구 도구</h3>
                      <p className="text-sm text-muted-foreground">
                        유전자 분석, 약물 재창출, 바이오메디컬 연구를 위한 AI 기반 도구
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-accent">🛡️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">블록체인 저장</h3>
                      <p className="text-sm text-muted-foreground">
                        연구 결과를 Base Sepolia에 영구 저장하여 검증 가능한 기록 생성
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-accent">⚡</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">실시간 AI 상호작용</h3>
                      <p className="text-sm text-muted-foreground">
                        SSE를 통한 실시간 AI 응답과 세션 기반 대화 관리
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-accent">👥</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">분산 과학 생태계</h3>
                      <p className="text-sm text-muted-foreground">
                        누구나 참여할 수 있는 개방형 과학 연구 플랫폼
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Development Workflow */}
          <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-accent">🔧</span>
                개발 워크플로우
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-accent">로컬 개발 환경</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <code className="bg-muted px-2 py-1 rounded">yarn chain</code>
                      <span className="text-muted-foreground">로컬 블록체인 시작</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <code className="bg-muted px-2 py-1 rounded">yarn deploy</code>
                      <span className="text-muted-foreground">스마트 컨트랙트 배포</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <code className="bg-muted px-2 py-1 rounded">yarn start</code>
                      <span className="text-muted-foreground">프론트엔드 시작</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <code className="bg-muted px-2 py-1 rounded">python main.py</code>
                      <span className="text-muted-foreground">백엔드 시작</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-accent">배포 환경</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span>프론트엔드: Vercel / IPFS</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span>백엔드: 자체 서버 / 클라우드</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span>블록체인: Base Sepolia</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Innovation */}
          <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-accent">🔗</span>
                프로젝트의 혁신성
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-accent">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">AI + 블록체인 융합</h4>
                      <p className="text-sm text-muted-foreground">
                        Biomni AI와 블록체인을 결합한 최초의 DeSci 플랫폼
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-accent">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">실시간 상호작용</h4>
                      <p className="text-sm text-muted-foreground">
                        SSE를 통한 실시간 AI 응답 스트리밍
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-accent">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">검증 가능한 과학</h4>
                      <p className="text-sm text-muted-foreground">
                        모든 연구 결과가 블록체인에 영구 저장
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-accent">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">개방형 생태계</h4>
                      <p className="text-sm text-muted-foreground">
                        누구나 참여할 수 있는 분산 과학 연구 플랫폼
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center space-y-4 py-8">
            <h2 className="text-2xl font-bold">과학 연구의 미래를 함께 만들어가세요</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              BV_BNB는 과학 연구의 민주화와 AI 기반 연구 자동화를 통해 
              과학의 미래를 재정의하는 혁신적인 DeSci 플랫폼입니다.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <a href="/dashboard">
                  <span className="mr-2">📊</span>
                  대시보드 시작하기
                </a>
              </Button>
              <Button variant="outline" asChild className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                <a href="/tools">
                  <span className="mr-2">🧬</span>
                  연구 도구 탐색
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}