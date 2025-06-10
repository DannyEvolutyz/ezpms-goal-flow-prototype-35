
import React, { useState } from "react";
import { useGoals } from "@/contexts/GoalContext";
import { GoalBank, Milestone } from "@/types";
import { ListCheck } from "lucide-react";
import GoalBankFormComponent from "./goal-bank/GoalBankForm";
import GoalBankList from "./goal-bank/GoalBankList";

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
  const [form, setForm] = useState<GoalBankForm>(blankTemplate());

  // ---- Form field update handler ----
  const handleFormChange = (field: keyof GoalBankForm, value: any) => {
    setForm(f => ({ ...f, [field]: value }));
  };

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

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex gap-2 items-center">
          <ListCheck className="inline w-5 h-5 text-violet-600" /> Goal Bank Management
        </h2>
        <p className="text-gray-600">
          Create, edit, or remove goal templates. Each goal can have milestones for progress tracking and is categorized by domain.
        </p>
      </div>

      <GoalBankFormComponent
        form={form}
        editing={editing}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
        onCancel={cancelEdit}
        onAddMilestone={addMilestone}
        onUpdateMilestone={updateMilestone}
        onRemoveMilestone={removeMilestone}
      />

      <GoalBankList
        goalBank={goalBank}
        onEdit={startEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default GoalBankManager;
