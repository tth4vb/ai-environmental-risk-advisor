'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, ChevronRight, Lightbulb, FileText, Download, FileCheck, Shield, Droplets, ClipboardList, Users, Scale, MessageSquare, BookOpen } from 'lucide-react';
import { learningArticles, LearningArticle } from '@/lib/dummy-data';

const articleCategories = [
  { value: 'all', label: 'All' },
  { value: 'water', label: 'Water & Environment' },
  { value: 'rights', label: 'Your Rights' },
  { value: 'mining-basics', label: 'Mining Basics' },
  { value: 'data-literacy', label: 'Understanding Data' },
] as const;

const categoryColors: Record<LearningArticle['category'], string> = {
  water: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  rights: 'bg-green-100 text-green-800 hover:bg-green-100',
  'mining-basics': 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  'data-literacy': 'bg-purple-100 text-purple-800 hover:bg-purple-100',
};

function ArticleBody() {
  return (
    <div className="prose prose-sm max-w-none space-y-4">
      <p className="text-gray-700 leading-relaxed">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 pt-2">Why This Matters for Your Community</h3>
      <p className="text-gray-700 leading-relaxed">
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
      </p>
      <p className="text-gray-700 leading-relaxed">
        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 pt-2">What You Can Do</h3>
      <p className="text-gray-700 leading-relaxed">
        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
      </p>
      <p className="text-gray-700 leading-relaxed">
        Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
      </p>

      <Alert className="mt-6">
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>Key Takeaways</AlertTitle>
        <AlertDescription>
          <ul className="list-disc pl-4 mt-2 space-y-1">
            <li>Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint.</li>
            <li>Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur.</li>
            <li>Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat.</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}

const sampleDocuments = [
  {
    id: 'cba-template',
    title: 'Community Benefits Agreement Template',
    description: 'Model agreement covering water monitoring, data sharing, community endowment, and response frameworks. Based on real Good Neighbor Agreements from Montana mining communities.',
    icon: Scale,
    category: 'Legal Template',
    pages: 24,
    format: 'PDF',
    color: 'text-green-700 bg-green-50 border-green-200',
  },
  {
    id: 'eia-comment-letter',
    title: 'EIA Comment Letter Template',
    description: 'Step-by-step template for writing formal comments on Environmental Impact Assessments. Includes sections on water, biodiversity, community displacement, and cumulative impacts.',
    icon: FileCheck,
    category: 'Legal Template',
    pages: 8,
    format: 'DOCX',
    color: 'text-green-700 bg-green-50 border-green-200',
  },
  {
    id: 'water-monitoring-guide',
    title: 'Water Quality Monitoring Report — Plain Language Guide',
    description: 'How to read and interpret water quality monitoring data. Explains common contaminants, safe thresholds, and what to do when levels are exceeded. Written for community members, not scientists.',
    icon: Droplets,
    category: 'Guide',
    pages: 16,
    format: 'PDF',
    color: 'text-blue-700 bg-blue-50 border-blue-200',
  },
  {
    id: 'fpic-checklist',
    title: 'FPIC Process Checklist & Rights Guide',
    description: 'Checklist for communities to verify that Free, Prior and Informed Consent is being properly conducted. Covers ILO Convention 169, UNDRIP requirements, and common violations to watch for.',
    icon: Shield,
    category: 'Checklist',
    pages: 12,
    format: 'PDF',
    color: 'text-amber-700 bg-amber-50 border-amber-200',
  },
  {
    id: 'questions-for-developers',
    title: 'Questions to Ask Mining Developers',
    description: 'Community-sourced list of questions to ask during public consultations and permit hearings. Covers water protection, waste management, closure plans, employment, and financial guarantees.',
    icon: ClipboardList,
    category: 'Guide',
    pages: 6,
    format: 'PDF',
    color: 'text-blue-700 bg-blue-50 border-blue-200',
  },
  {
    id: 'grievance-filing',
    title: 'How to File an Environmental Grievance',
    description: 'Step-by-step guide for documenting and reporting environmental concerns to village offices, government agencies, and company grievance mechanisms. Includes sample complaint forms.',
    icon: MessageSquare,
    category: 'Guide',
    pages: 10,
    format: 'PDF',
    color: 'text-blue-700 bg-blue-50 border-blue-200',
  },
  {
    id: 'citizen-sampling',
    title: 'Citizen Water Sampling Program Guide',
    description: 'How to set up independent water sampling. Covers equipment, protocols, chain-of-custody, and how to request duplicate samples from company monitoring programs.',
    icon: Users,
    category: 'Technical Guide',
    pages: 18,
    format: 'PDF',
    color: 'text-purple-700 bg-purple-50 border-purple-200',
  },
  {
    id: 'baseline-report-template',
    title: 'Baseline Environmental Conditions Report Template',
    description: 'Template for documenting pre-mining environmental conditions (water quality, soil, biodiversity, land use) so communities have evidence if conditions deteriorate after mining begins.',
    icon: FileText,
    category: 'Template',
    pages: 14,
    format: 'DOCX',
    color: 'text-green-700 bg-green-50 border-green-200',
  },
];

export function LearnSection() {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const selectedArticle = selectedArticleId
    ? learningArticles.find(a => a.id === selectedArticleId) ?? null
    : null;

  const filteredArticles = activeCategory === 'all'
    ? learningArticles
    : learningArticles.filter(a => a.category === activeCategory);

  // Reading an individual article
  if (selectedArticle) {
    const relatedArticles = learningArticles.filter(a =>
      selectedArticle.relatedIds.includes(a.id)
    );

    return (
      <Card>
        <CardContent className="p-6 space-y-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedArticleId(null)}
            className="-ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learn
          </Button>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className={`text-xs ${categoryColors[selectedArticle.category]}`}
              >
                {selectedArticle.categoryLabel}
              </Badge>
              <span className="text-xs text-gray-400">{selectedArticle.readTime}</span>
            </div>
            <h2 className="text-2xl font-bold">{selectedArticle.title}</h2>
            <p className="text-gray-500">{selectedArticle.description}</p>
          </div>

          <ArticleBody />

          {relatedArticles.length > 0 && (
            <div className="border-t pt-6 mt-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">Related Articles</h3>
              <div className="space-y-2">
                {relatedArticles.map(related => (
                  <button
                    key={related.id}
                    onClick={() => setSelectedArticleId(related.id)}
                    className="block text-left w-full p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${categoryColors[related.category]}`}
                      >
                        {related.categoryLabel}
                      </Badge>
                      <span className="text-sm font-medium">{related.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Browse state — tabbed layout
  return (
    <Card>
      <CardHeader>
        <CardTitle>Learn About Mining & Your Rights</CardTitle>
        <CardDescription>
          Educational articles and practical documents to help your community understand environmental risks, know your rights, and take action.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="articles" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="articles">
              <BookOpen className="w-4 h-4 mr-1.5" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="w-4 h-4 mr-1.5" />
              Documents & Templates
            </TabsTrigger>
          </TabsList>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-4">
            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              {articleCategories.map(cat => (
                <Badge
                  key={cat.value}
                  variant={activeCategory === cat.value ? 'default' : 'outline'}
                  className="cursor-pointer text-sm px-3 py-1"
                  onClick={() => setActiveCategory(cat.value)}
                >
                  {cat.label}
                </Badge>
              ))}
            </div>

            {/* Article grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles.map(article => (
                <Card
                  key={article.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedArticleId(article.id)}
                >
                  <CardContent className="p-4 flex flex-col gap-2">
                    <Badge
                      variant="secondary"
                      className={`w-fit text-xs ${categoryColors[article.category]}`}
                    >
                      {article.categoryLabel}
                    </Badge>
                    <h3 className="font-semibold text-sm leading-tight">{article.title}</h3>
                    <p className="text-xs text-gray-500">{article.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="text-xs text-gray-400">{article.readTime}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Documents & Templates Tab */}
          <TabsContent value="documents" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Downloadable templates, checklists, and guides based on real community needs identified through interviews across the US, Indonesia, and DRC.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sampleDocuments.map((doc) => {
                const Icon = doc.icon;
                return (
                  <div
                    key={doc.id}
                    className={`border rounded-lg p-4 space-y-2 ${doc.color}`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <h4 className="text-sm font-semibold leading-tight">{doc.title}</h4>
                    </div>
                    <p className="text-xs opacity-80 leading-relaxed">{doc.description}</p>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-3 text-xs opacity-60">
                        <span>{doc.format}</span>
                        <span>{doc.pages} pages</span>
                        <Badge variant="outline" className="text-xs py-0 h-5">
                          {doc.category}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" disabled>
                        <Download className="w-3 h-3" />
                        Coming Soon
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
