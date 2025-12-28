"use client";

import { usePromptContext } from "@/lib/prompt-context";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { OptionGrid } from "@/components/ui/OptionGrid";
import { SUBJECT_CATEGORIES, COMPOSITIONS, BACKGROUNDS } from "@/lib/constants";

export function SubjectSection() {
  const { state, updateState } = usePromptContext();

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <OptionGrid
        label="What are you creating?"
        options={SUBJECT_CATEGORIES.map((cat) => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon,
          description: cat.description,
        }))}
        value={state.subjectCategory}
        onChange={(value) => updateState("subjectCategory", value)}
        columns={5}
        size="sm"
      />

      {/* Main Subject */}
      <Textarea
        label="Describe your subject"
        placeholder="A majestic lion with a golden mane, sitting on a rock..."
        value={state.subject}
        onChange={(e) => updateState("subject", e.target.value)}
        rows={3}
        hint="Be specific about what you want to see. Lead with the most important elements."
      />

      {/* Action/Pose */}
      <Input
        label="Action or Pose (optional)"
        placeholder="running through a field, looking at the camera..."
        value={state.action}
        onChange={(e) => updateState("action", e.target.value)}
        hint="Describe what the subject is doing"
      />

      {/* Setting/Environment */}
      <Input
        label="Setting or Environment (optional)"
        placeholder="a mystical forest at dawn, a modern office..."
        value={state.setting}
        onChange={(e) => updateState("setting", e.target.value)}
        hint="Where is the scene taking place?"
      />

      {/* Composition */}
      <OptionGrid
        label="Composition"
        options={COMPOSITIONS.map((c) => ({
          id: c.id,
          name: c.name,
          description: c.description,
        }))}
        value={state.composition}
        onChange={(value) => updateState("composition", value)}
        columns={5}
        size="sm"
      />

      {/* Background */}
      <OptionGrid
        label="Background"
        options={BACKGROUNDS.map((b) => ({
          id: b.id,
          name: b.name,
        }))}
        value={state.background}
        onChange={(value) => updateState("background", value)}
        columns={5}
        size="sm"
      />

      {/* Tips */}
      <div className="p-4 bg-[#998748]/10 dark:bg-[#998748]/20 rounded-lg border border-[#998748]/30 dark:border-[#998748]/40">
        <h4 className="text-sm font-semibold text-[#1A1A1A] dark:text-[#f4f4f4] mb-2">
          Pro Tips
        </h4>
        <ul className="text-sm text-[#6b6b6b] dark:text-[#d1c69e] space-y-1">
          <li>• Lead with the most important element of your image</li>
          <li>• Be specific: &ldquo;golden retriever puppy&rdquo; vs just &ldquo;dog&rdquo;</li>
          <li>• Mention only one main subject to avoid confusion</li>
          <li>• Specify background explicitly for cleaner results</li>
        </ul>
      </div>
    </div>
  );
}
