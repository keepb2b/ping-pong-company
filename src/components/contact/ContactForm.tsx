'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormState {
  cname: string;
  name: string;
  email: string;
  tel: string;
  content: string;
  privacy: boolean;
}

const initial: FormState = {
  cname: '',
  name: '',
  email: '',
  tel: '',
  content: '',
  privacy: false,
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.cname.trim()) next.cname = '御社名を入力してください';
    if (!form.name.trim()) next.name = 'ご担当者名を入力してください';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = '有効なメールアドレスを入力してください';
    }
    if (!form.tel.trim()) next.tel = '電話番号を入力してください';
    if (!form.content.trim()) next.content = 'お問い合わせ内容を入力してください';
    if (!form.privacy) next.privacy = 'プライバシーポリシーに同意してください';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setConfirmed(true);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setConfirmed(false);
    setForm(initial);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg rounded-lg border border-green-200 bg-green-50 p-8 text-center">
        <h2 className="text-lg font-bold text-green-800">送信が完了しました</h2>
        <p className="mt-3 text-sm text-green-700">
          お問い合わせありがとうございます。担当者より折り返しご連絡いたします。（デモ送信のため実際のメールは送信されません）
        </p>
        <button type="button" className="btn-primary mt-6" onClick={() => setSubmitted(false)}>
          新しいお問い合わせ
        </button>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleConfirm} className="mx-auto max-w-3xl" noValidate>
        <table className="w-full border-collapse text-sm">
          <tbody>
            {(
              [
                ['cname', '御社名', '御社名を入力してください', 'text'],
                ['name', 'ご担当者名', '担当者を入力してください', 'text'],
                ['email', 'メールアドレス', 'メールアドレスを入力して下さい', 'email'],
                ['tel', '電話番号', '電話番号を入力して下さい', 'tel'],
              ] as const
            ).map(([key, label, placeholder, type]) => (
              <tr key={key} className="border-b border-slate-200">
                <th className="w-1/3 py-4 pr-4 text-left align-top font-bold">
                  {label}
                  <span className="text-brand-orange">*</span>
                </th>
                <td className="py-4">
                  <input
                    type={type}
                    name={key}
                    value={form[key]}
                    placeholder={placeholder}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className={`w-full rounded border px-3 py-2 ${errors[key] ? 'border-red-400' : 'border-slate-300'}`}
                  />
                  {errors[key] && <p className="mt-1 text-xs text-red-500">{errors[key]}</p>}
                </td>
              </tr>
            ))}
            <tr className="border-b border-slate-200">
              <th className="py-4 pr-4 text-left align-top font-bold">
                お問い合わせ内容<span className="text-brand-orange">*</span>
              </th>
              <td className="py-4">
                <textarea
                  name="content"
                  rows={8}
                  value={form.content}
                  placeholder="こちらにご相談やお問合せ内容をご記入ください。"
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  className={`w-full rounded border px-3 py-2 ${errors.content ? 'border-red-400' : 'border-slate-300'}`}
                />
                {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content}</p>}
              </td>
            </tr>
          </tbody>
        </table>

        <p className="mt-6 text-center text-xs text-muted">
          必要事項をご記入のうえ、「内容を確認する」ボタンを押してください。
          <br />
          <a href="/privacy" className="text-brand-blue underline" target="_blank" rel="noopener noreferrer">
            プライバシーポリシー
          </a>
          の内容をご参照いただき、ご同意いただいた上でお問い合わせください
        </p>

        <div className="mt-6 flex flex-col items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.privacy}
              onChange={(e) => setForm((f) => ({ ...f, privacy: e.target.checked }))}
            />
            個人情報の取扱いに同意する
          </label>
          {errors.privacy && <p className="text-xs text-red-500">{errors.privacy}</p>}
          <button
            type="submit"
            className="btn-primary min-w-[240px] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!form.privacy}
          >
            入力内容を確認する
          </button>
        </div>
      </form>

      <AnimatePresence>
        {confirmed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-lg bg-white p-6 shadow-xl"
            >
              <h2 id="confirm-title" className="text-lg font-bold">
                入力内容の確認
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="font-bold text-muted">御社名</dt>
                  <dd>{form.cname}</dd>
                </div>
                <div>
                  <dt className="font-bold text-muted">ご担当者名</dt>
                  <dd>{form.name}</dd>
                </div>
                <div>
                  <dt className="font-bold text-muted">メール</dt>
                  <dd>{form.email}</dd>
                </div>
                <div>
                  <dt className="font-bold text-muted">電話</dt>
                  <dd>{form.tel}</dd>
                </div>
                <div>
                  <dt className="font-bold text-muted">お問い合わせ内容</dt>
                  <dd className="whitespace-pre-wrap">{form.content}</dd>
                </div>
              </dl>
              <div className="mt-6 flex gap-3">
                <button type="button" className="btn-outline flex-1" onClick={() => setConfirmed(false)}>
                  修正する
                </button>
                <button type="button" className="btn-primary flex-1" onClick={handleSubmit}>
                  送信する
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
