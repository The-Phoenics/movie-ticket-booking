"use client";

export type ShowtimeFormValues = {
  date: string;
  time: string;
  price: string;
};

export function ShowtimeForm({
  value,
  onChange,
}: {
  value: ShowtimeFormValues;
  onChange: (value: ShowtimeFormValues) => void;
}) {
  function update<K extends keyof ShowtimeFormValues>(key: K, val: ShowtimeFormValues[K]) {
    onChange({ ...value, [key]: val });
  }

  return (
    <div className="mt-4 flex flex-col gap-4 sm:flex-row">
      <Field label="Date">
        <input
          type="date"
          value={value.date}
          onChange={(e) => update("date", e.target.value)}
          className="w-full rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-red-500"
        />
      </Field>
      <Field label="Time">
        <input
          type="time"
          value={value.time}
          onChange={(e) => update("time", e.target.value)}
          className="w-full rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-red-500"
        />
      </Field>
      <Field label="Price">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500 flex justify-center items-center">
            ₹
          </span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={value.price}
            onChange={(e) => update("price", e.target.value)}
            placeholder="0.00"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900/60 py-2 pl-6 pr-3 text-sm text-zinc-100 outline-none focus:border-red-500"
          />
        </div>
      </Field>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-1 flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</span>
      {children}
    </label>
  );
}
