
import React, { useState } from "react";
import { useGoals } from "@/contexts/GoalContext";
import { GoalBank, Milestone } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, X, ListCheck } from "lucide-react";

// LOCAL TYPE for the form state: like GoalBank, but milestones omits 'id'
type GoalBankForm = Omit<GoalBank, "id" | "milestones"> & {
  milestones: Omit<Milestone, "id">[]
};

// Always returns {title, description} (no id)
const blankMilestone = (): Omit<Milestone, "id"> => ({
  title: "",
  description: "",
});

// Always returns all fields, milestones never undefined
const blankTemplate = (): GoalBankForm => ({
  title: "",
  description: "",
  category: "",
  targetAudience: "All",
  createdBy: "admin",
  isActive: true,
  milestones: [],
});

const GoalBankManager = () => {
  const { goalBank, addGoalTemplate, updateGoalTemplate, deleteGoalTemplate } = useGoals();
  const [editing, setEditing] = useState<GoalBank | null>(null);

  // use local GoalBankForm type for strict type-safety
  const [form, setForm] = useState<GoalBankForm>(blankTemplate());

  // ---- Milestone management for the form ----
  const addMilestone = () => {
    setForm(f => ({
      ...f,
      milestones: [...f.milestones, blankMilestone()],
    }));
  };
  const updateMilestone = (idx: number, val: Partial<Omit<Milestone, 'id'>>) => {
    setForm(f => ({
      ...f,
      milestones: f.milestones.map((m, i) => i === idx ? { ...m, ...val } : m),
    }));
  };
  const removeMilestone = (idx: number) => {
    setForm(f => ({
      ...f,
      milestones: f.milestones.filter((_, i) => i !== idx),
    }));
  };

  // ---- GoalBank CRUD Handlers ----
  const startEdit = (tpl: GoalBank) => {
    setEditing(tpl);
    setForm({
      title: tpl.title,
      description: tpl.description,
      category: tpl.category,
      targetAudience: tpl.targetAudience,
      createdBy: tpl.createdBy,
      isActive: tpl.isActive,
      // Drop milestone id for local editing
      milestones: (tpl.milestones || []).map((m) => ({
        title: m.title,
        description: m.description || "",
      })),
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(blankTemplate());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.category.trim()) return;

    // Always assign ID on submit
    const milestones: Milestone[] = form.milestones.map((m, i) => ({
      id: (editing && editing.milestones && editing.milestones[i]?.id) 
        ? editing.milestones[i].id
        : `milestone-${Date.now()}-${i}`,
      title: m.title,
      description: m.description,
    }));

    if (editing) {
      updateGoalTemplate({
        ...editing,
        title: form.title,
        description: form.description,
        category: form.category,
        targetAudience: form.targetAudience,
        createdBy: form.createdBy,
        isActive: form.isActive,
        milestones,
      });
    } else {
      addGoalTemplate({
        title: form.title,
        description: form.description,
        category: form.category,
        targetAudience: form.targetAudience,
        createdBy: form.createdBy,
        isActive: form.isActive,
        milestones,
      });
    }
    cancelEdit();
  };

  const handleDelete = (tpl: GoalBank) => {
    if (window.confirm("Delete this goal template?")) {
      deleteGoalTemplate(tpl.id);
    }
  };

  // ---- UI ----
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex gap-2 items-center">
          <ListCheck className="inline w-5 h-5 text-violet-600" /> Goal Bank Management
        </h2>
        <p className="text-gray-600">Create, edit, or remove goal templates. Each goal can have milestones for progress tracking and is categorized by domain.</p>
      </div>

      <form className="bg-gray-50 p-4 rounded-md mb-10 shadow" onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block text-sm font-semibold">Title</label>
          <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-semibold">Description</label>
          <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-semibold">Category</label>
          <Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required placeholder="E.g., Software Engineering, QA" />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-semibold">Target Audience</label>
          <Input value={form.targetAudience} onChange={e => setForm(f => ({ ...f, targetAudience: e.target.value }))} required placeholder="E.g., All, Managers, Developers" />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-semibold">
            Milestones <Plus onClick={addMilestone} className="w-5 h-5 ml-2 cursor-pointer text-green-700" />
          </label>
          {form.milestones.length === 0 && (
            <div className="ml-3 text-gray-500 text-sm">Add at least one milestone</div>
          )}
          {form.milestones.map((milestone, idx) => (
            <div className="flex items-center gap-2 mb-2 ml-4" key={idx}>
              <Input
                value={milestone.title}
                onChange={e =>
                  updateMilestone(idx, { title: e.target.value })
                }
                placeholder={`Milestone #${idx + 1}`}
                className="flex-auto"
                required
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeMilestone(idx)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <Button type="submit" variant="default">{editing ? "Update" : "Add"} Goal Template</Button>
          {editing && (
            <Button type="button" variant="secondary" onClick={cancelEdit}>Cancel</Button>
          )}
        </div>
      </form>
      <div>
        <h3 className="text-lg font-semibold mb-2">Existing Goal Templates</h3>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {goalBank.map(tpl => (
            <Card key={tpl.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {tpl.title}
                  <span className="text-xs font-light bg-gray-100 rounded px-2 py-0.5 ml-2">{tpl.category}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2">{tpl.description}</div>
                <div className="mb-2">
                  <span className="font-medium">Target Audience:</span> {tpl.targetAudience}
                </div>
                <div>
                  <span className="font-medium">Milestones:</span>
                  <ul className="list-decimal ml-6">
                    {(tpl.milestones || []).map((m, i) => (
                      <li key={m.id || i}>{m.title}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" onClick={() => startEdit(tpl)}>
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(tpl)}>
                    <X className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoalBankManager;
