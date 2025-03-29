import React, { useState, useEffect } from "react";
import { Question, QuestionFilters, Difficulty } from "@/types/question";
import { getQuestions, getQuestionStats, deleteQuestion } from "@/lib/database";
import { parseQuestionsCsv } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import QuestionForm from "./QuestionForm";
import {
  Search,
  Plus,
  Filter,
  FileText,
  Edit,
  Trash2,
  Eye,
  Upload,
  Download,
  BarChart3,
} from "lucide-react";

const QuestionBank = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filters, setFilters] = useState<QuestionFilters>({});
  const [stats, setStats] = useState<any>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [csvData, setCsvData] = useState("");
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  // Load questions and stats
  useEffect(() => {
    loadQuestions();
    loadStats();
  }, [filters]);

  // Initial data loading
  useEffect(() => {
    loadQuestions();
    loadStats();
  }, []);

  const loadQuestions = async () => {
    try {
      const fetchedQuestions = await getQuestions(filters);
      setQuestions(fetchedQuestions);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(fetchedQuestions.map((q) => q.category)),
      );
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error loading questions:", error);
    }
  };

  const loadStats = async () => {
    try {
      const fetchedStats = await getQuestionStats();
      setStats(fetchedStats);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleCreateQuestion = async (data: Partial<Question>) => {
    try {
      await createQuestion(data as Omit<Question, "id">);
      setIsFormOpen(false);
      loadQuestions();
      loadStats();
    } catch (error) {
      console.error("Error creating question:", error);
    }
  };

  const handleUpdateQuestion = async (data: Partial<Question>) => {
    try {
      if (selectedQuestion?.id) {
        await updateQuestion(selectedQuestion.id, data);
        setIsFormOpen(false);
        setSelectedQuestion(null);
        loadQuestions();
        loadStats();
      }
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      await deleteQuestion(id);
      setQuestionToDelete(null);
      loadQuestions();
      loadStats();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleImportCsv = () => {
    try {
      const parsedQuestions = parseQuestionsCsv(csvData);
      console.log("Parsed questions:", parsedQuestions);
      // In a real app, this would be an API call to bulk create questions
      setIsImportOpen(false);
      setCsvData("");
      loadQuestions();
      loadStats();
    } catch (error) {
      console.error("Error parsing CSV:", error);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      setCsvData(text);
      return { success: true };
    } catch (error) {
      console.error("Error reading file:", error);
      return { success: false, error: "Failed to read file" };
    }
  };

  const exportQuestions = () => {
    // Create CSV content
    const headers = [
      "text",
      "category",
      "difficulty",
      "points",
      "imageUrl",
      "options",
    ];
    const rows = questions.map((q) => {
      const optionsStr = q.options
        .map((opt) => `${opt.text}:${opt.isCorrect}`)
        .join(";");
      return [
        q.text,
        q.category,
        q.difficulty,
        q.points || 10,
        q.imageUrl || "",
        optionsStr,
      ];
    });

    const csvContent =
      headers.join(",") + "\n" + rows.map((row) => row.join(",")).join("\n");

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute(
      "download",
      `questions_export_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    a.click();
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "basic":
        return "bg-blue-100 text-blue-800";
      case "intermediate":
        return "bg-amber-100 text-amber-800";
      case "advanced":
        return "bg-purple-100 text-purple-800";
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Question Bank</h1>
          <p className="text-gray-500">
            Manage your quiz questions and categories
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setIsStatsOpen(true)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Statistics
          </Button>
          <Button onClick={exportQuestions} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsImportOpen(true)} variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search questions..."
                className="pl-10"
                value={filters.searchTerm || ""}
                onChange={(e) =>
                  setFilters({ ...filters, searchTerm: e.target.value })
                }
              />
            </div>

            <div className="flex gap-4">
              <Select
                value={filters.difficulty || ""}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    difficulty: value as Difficulty | undefined,
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Difficulties" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Difficulties</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.category || ""}
                onValueChange={(value) =>
                  setFilters({ ...filters, category: value })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Categories" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Points</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-gray-500">No questions found</p>
                    <Button
                      variant="link"
                      onClick={() => setIsFormOpen(true)}
                      className="mt-2"
                    >
                      Add your first question
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                questions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell className="font-medium max-w-md truncate">
                      {question.text}
                    </TableCell>
                    <TableCell>{question.category}</TableCell>
                    <TableCell>
                      <Badge
                        className={getDifficultyColor(question.difficulty)}
                        variant="outline"
                      >
                        {question.difficulty.charAt(0).toUpperCase() +
                          question.difficulty.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{question.points || 10}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedQuestion(question);
                            setIsPreviewOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedQuestion(question);
                            setIsFormOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setQuestionToDelete(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Question Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl">
          <QuestionForm
            initialData={selectedQuestion || undefined}
            onSubmit={
              selectedQuestion ? handleUpdateQuestion : handleCreateQuestion
            }
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedQuestion(null);
            }}
            categories={categories}
          />
        </DialogContent>
      </Dialog>

      {/* Question Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Question Preview</DialogTitle>
            <DialogDescription>
              Preview how this question will appear in the quiz
            </DialogDescription>
          </DialogHeader>

          {selectedQuestion && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-50">
                <p className="text-lg font-medium">{selectedQuestion.text}</p>
                {selectedQuestion.imageUrl && (
                  <img
                    src={selectedQuestion.imageUrl}
                    alt="Question visual"
                    className="mt-4 rounded-md max-h-[200px] object-contain"
                  />
                )}
              </div>

              <div className="space-y-2">
                <p className="font-medium">Answer Options:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedQuestion.options.map((option) => (
                    <div
                      key={option.id}
                      className={`p-3 rounded-md border ${option.isCorrect ? "border-green-500 bg-green-50" : "border-gray-200"}`}
                    >
                      <div className="flex items-center">
                        <span className="font-medium mr-2">
                          {option.id.toUpperCase()}.
                        </span>
                        <span>{option.text}</span>
                        {option.isCorrect && (
                          <Badge className="ml-auto bg-green-500">
                            Correct
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-sm text-gray-500">
                <div>
                  <span className="font-medium">Category:</span>{" "}
                  {selectedQuestion.category}
                </div>
                <div>
                  <span className="font-medium">Difficulty:</span>{" "}
                  {selectedQuestion.difficulty}
                </div>
                <div>
                  <span className="font-medium">Points:</span>{" "}
                  {selectedQuestion.points || 10}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsPreviewOpen(false);
                setSelectedQuestion(null);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Questions</DialogTitle>
            <DialogDescription>
              Upload a CSV file or paste CSV data to import questions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <FileUpload
              accept=".csv,text/csv"
              onUpload={handleFileUpload}
              buttonText="Upload CSV File"
              description="Upload a CSV file with question data"
            />

            <div className="- or -">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or paste CSV data
                  </span>
                </div>
              </div>
            </div>

            <Textarea
              placeholder="text,category,difficulty,points,imageUrl,options
What is the most common mineral?,Geology,basic,10,,Quartz:false;Feldspar:true;Mica:false;Calcite:false"
              className="min-h-[200px] font-mono text-sm"
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
            />

            <div className="text-sm text-gray-500">
              <p className="font-medium">CSV Format:</p>
              <p>text,category,difficulty,points,imageUrl,options</p>
              <p className="mt-2">
                Options format: text:isCorrect;text:isCorrect;...
              </p>
              <p className="mt-2">
                Example: What is
                gold?,Minerals,basic,10,,Gold:true;Silver:false;Bronze:false;Copper:false
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImportCsv} disabled={!csvData.trim()}>
              Import Questions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Statistics Dialog */}
      <Dialog open={isStatsOpen} onOpenChange={setIsStatsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Question Statistics</DialogTitle>
            <DialogDescription>
              Overview of your question bank
            </DialogDescription>
          </DialogHeader>

          {stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Total Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats.totalQuestions}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {Object.keys(stats.byCategory).length}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Avg. Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">10</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">By Difficulty</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-blue-50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-blue-800">Basic</p>
                        <Badge className="bg-blue-500">
                          {stats.byDifficulty.basic}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-amber-50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-amber-800">
                          Intermediate
                        </p>
                        <Badge className="bg-amber-500">
                          {stats.byDifficulty.intermediate}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-purple-800">Advanced</p>
                        <Badge className="bg-purple-500">
                          {stats.byDifficulty.advanced}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">By Category</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(stats.byCategory).map(([category, count]) => (
                    <Card key={category}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <p className="font-medium truncate">{category}</p>
                          <Badge variant="outline">{count as number}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!questionToDelete}
        onOpenChange={(open) => !open && setQuestionToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              question from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                questionToDelete && handleDeleteQuestion(questionToDelete)
              }
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuestionBank;
