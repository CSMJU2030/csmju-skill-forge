'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { GeneratedDocument } from '@/lib/types';

type Tab = 'resume' | 'cover_letter' | 'portfolio';
type RetentionMode = 'session' | 'until_deleted' | 'days';
type Provider = 'openai' | 'gemini' | 'openrouter' | 'custom';

const PROVIDERS: { id: Provider; label: string; baseUrl: string }[] = [
  { id: 'openai', label: 'OpenAI', baseUrl: 'https://api.openai.com/v1' },
  {
    id: 'gemini',
    label: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
  },
  { id: 'custom', label: 'อื่น ๆ (OpenAI-compatible)', baseUrl: '' },
];

interface LlmConfig {
  base_url: string;
  model: string;
  api_key: string;
}

interface SavedLlmSettings {
  base_url: string;
  model: string;
  retention_mode: 'until_deleted' | 'days';
  expires_at: string | null;
  updated_at: string;
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'resume', label: 'เรซูเม่' },
  { id: 'cover_letter', label: 'จดหมายสมัครงาน' },
  { id: 'portfolio', label: 'พอร์ตโฟลิโอ' },
];

export function DocumentGenerator({
  initialDocuments,
}: {
  initialDocuments: GeneratedDocument[];
}) {
  const [tab, setTab] = useState<Tab>('resume');
  const [documents, setDocuments] = useState(initialDocuments);
  const [result, setResult] = useState<GeneratedDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [hiringManager, setHiringManager] = useState('');
  const [whyInterested, setWhyInterested] = useState('');
  const [tagline, setTagline] = useState('');
  const [highlights, setHighlights] = useState('');

  const [provider, setProvider] = useState<Provider>('openai');
  const [baseUrl, setBaseUrl] = useState(PROVIDERS[0].baseUrl);
  const [model, setModel] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [retentionMode, setRetentionMode] = useState<RetentionMode>('session');
  const [retentionDays, setRetentionDays] = useState(30);
  const [savedSettings, setSavedSettings] = useState<SavedLlmSettings | null>(
    null,
  );
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [settingsBusy, setSettingsBusy] = useState(true);
  const [settingsActionBusy, setSettingsActionBusy] = useState(false);
  const [modelsBusy, setModelsBusy] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get<SavedLlmSettings | null>('/students/me/llm-settings')
      .then((settings) => {
        if (cancelled || !settings) return;
        setSavedSettings(settings);
        const matchedProvider =
          PROVIDERS.find(
            (item) => item.id !== 'custom' && item.baseUrl === settings.base_url,
          )?.id ?? 'custom';
        setProvider(matchedProvider);
        setBaseUrl(settings.base_url);
        setModel(settings.model);
        setRetentionMode(settings.retention_mode);
        setNotice('โหลดการตั้งค่า AI API ที่บันทึกไว้แล้ว (ระบบไม่ส่ง API key กลับมา)');
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setSettingsError(
            error instanceof Error
              ? error.message
              : 'โหลดการตั้งค่า AI API ไม่สำเร็จ',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setSettingsBusy(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function currentConfig(): LlmConfig {
    return {
      base_url: baseUrl.trim(),
      model: model.trim(),
      api_key: apiKey.trim(),
    };
  }

  function changeProvider(nextProvider: Provider) {
    setProvider(nextProvider);
    const option = PROVIDERS.find((item) => item.id === nextProvider);
    setBaseUrl(nextProvider === 'custom' ? '' : option?.baseUrl ?? '');
    setAvailableModels([]);
    setModel('');
    setSettingsError(null);
  }

  async function loadModels() {
    setModelsBusy(true);
    setSettingsError(null);
    setAvailableModels([]);
    setModel('');
    try {
      const models = await api.post<string[]>(
        '/students/me/llm-settings/models',
        apiKey.trim()
          ? { base_url: baseUrl.trim(), api_key: apiKey.trim() }
          : {},
      );
      setAvailableModels(models);
      if (models.length === 0) {
        setSettingsError(
          'ไม่พบโมเดลจากผู้ให้บริการนี้ ตรวจสอบ API key และ Base URL หรือเลือกผู้ให้บริการที่รองรับ',
        );
      }
    } catch (error) {
      setSettingsError(
        error instanceof Error ? error.message : 'โหลดรายชื่อโมเดลไม่สำเร็จ',
      );
    } finally {
      setModelsBusy(false);
    }
  }

  async function saveSettings() {
    if (!model.trim()) {
      setSettingsError('กรุณาโหลดและเลือก Model ID ก่อนบันทึก');
      return;
    }
    setSettingsActionBusy(true);
    setSettingsError(null);
    setNotice(null);
    try {
      const saved = await api.put<SavedLlmSettings>(
        '/students/me/llm-settings',
        {
          ...currentConfig(),
          api_key: apiKey.trim() || undefined,
          retention_mode: retentionMode,
          ...(retentionMode === 'days'
            ? { retention_days: retentionDays }
            : {}),
        },
      );
      setSavedSettings(saved);
      setApiKey('');
      setNotice('บันทึกการตั้งค่าแล้ว โดย API key ถูกเข้ารหัสก่อนจัดเก็บ');
    } catch (error) {
      setSettingsError(
        error instanceof Error ? error.message : 'บันทึกการตั้งค่าไม่สำเร็จ',
      );
    } finally {
      setSettingsActionBusy(false);
    }
  }

  async function deleteSettings() {
    setSettingsActionBusy(true);
    setSettingsError(null);
    setNotice(null);
    try {
      await api.delete('/students/me/llm-settings');
      setSavedSettings(null);
      setApiKey('');
      setRetentionMode('session');
      setNotice('ลบ API key และการตั้งค่าที่บันทึกไว้ออกจากระบบแล้ว');
    } catch (error) {
      setSettingsError(
        error instanceof Error ? error.message : 'ลบการตั้งค่าไม่สำเร็จ',
      );
    } finally {
      setSettingsActionBusy(false);
    }
  }

  function transientConfig() {
    if (retentionMode !== 'session') return undefined;
    const config = currentConfig();
    if (!config.base_url || !config.model || !config.api_key) return undefined;
    return config;
  }

  function canGenerate() {
    if (settingsBusy) return false;
    if (retentionMode === 'session') {
      return Boolean(baseUrl.trim() && model.trim() && apiKey.trim());
    }
    return Boolean(
      savedSettings &&
        savedSettings.base_url === baseUrl &&
        savedSettings.model === model,
    );
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setGenerationError(null);
    try {
      const llm_config = transientConfig();
      let doc: GeneratedDocument;
      if (tab === 'resume') {
        doc = await api.post<GeneratedDocument>('/documents/resume', {
          full_name: fullName,
          email,
          phone: phone || undefined,
          highlights: highlights
            ? highlights.split('\n').filter(Boolean)
            : undefined,
          llm_config,
        });
      } else if (tab === 'cover_letter') {
        doc = await api.post<GeneratedDocument>('/documents/cover-letter', {
          full_name: fullName,
          email,
          company_name: company,
          hiring_manager_name: hiringManager || undefined,
          why_interested: whyInterested || undefined,
          llm_config,
        });
      } else {
        doc = await api.post<GeneratedDocument>('/documents/portfolio', {
          full_name: fullName,
          tagline: tagline || undefined,
          llm_config,
        });
      }
      setResult(doc);
      setDocuments((prev) => [doc, ...prev]);
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : 'สร้างเอกสารไม่สำเร็จ',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <section className="mb-6 space-y-4 rounded-module border border-secondary bg-white p-5">
        <div>
          <h2 className="font-display font-semibold text-neutral">
            ตั้งค่า AI API ของคุณ
          </h2>
          <p className="mt-1 font-body text-sm leading-relaxed text-neutral/65">
            ใช้ API key และค่าใช้บริการจากผู้ให้บริการ AI ของคุณเอง
            รองรับ API รูปแบบ OpenAI-compatible โดยระบุ Base URL และ model ID
            เอง การสร้างเอกสารจะส่งข้อมูลที่เกี่ยวข้องกับงานนั้น รวมถึงข้อมูลที่กรอก
            และบริบทจากผลการเรียน/ทักษะ ไปยังผู้ให้บริการที่เลือก
          </p>
        </div>

        {savedSettings && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-strength/20 bg-strength/5 p-3">
            <p className="font-body text-sm text-neutral">
              มีการตั้งค่าที่บันทึกไว้: {savedSettings.model}
              {savedSettings.expires_at
                ? ` · ลบอัตโนมัติ ${new Date(savedSettings.expires_at).toLocaleString('th-TH')}`
                : ' · เก็บไว้จนกว่าคุณจะลบ'}
            </p>
            <button
              type="button"
              onClick={deleteSettings}
              disabled={settingsActionBusy}
              className="rounded-full border border-gap/30 px-4 py-2 font-body text-sm text-gap hover:bg-gap/5 disabled:opacity-50"
            >
              ลบ API key ที่บันทึกไว้
            </button>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="ผู้ให้บริการ AI">
            <select
              value={provider}
              onChange={(event) =>
                changeProvider(event.target.value as Provider)
              }
              className={inputClass}
            >
              {PROVIDERS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>
          {provider === 'custom' ? (
            <Field label="Base URL ของ OpenAI-compatible API (HTTPS)">
              <input
                type="url"
                value={baseUrl}
                onChange={(event) => {
                  setBaseUrl(event.target.value);
                  setAvailableModels([]);
                  setModel('');
                  setSettingsError(null);
                }}
                placeholder="https://api.example.com/v1"
                className={inputClass}
                required
              />
            </Field>
          ) : (
            <Field label="Base URL (กำหนดตามผู้ให้บริการ)">
              <input
                value={baseUrl}
                readOnly
                className={`${inputClass} bg-tertiary/60 text-neutral/65`}
              />
            </Field>
          )}
          <Field label="API key">
            <div className="relative">
              <input
                type={apiKeyVisible ? 'text' : 'password'}
                value={apiKey}
                onChange={(event) => {
                  setApiKey(event.target.value);
                  setAvailableModels([]);
                  setModel('');
                  setSettingsError(null);
                }}
                autoComplete="new-password"
                placeholder={
                  savedSettings
                    ? 'บันทึกแล้วจะไม่แสดง key เดิม'
                    : 'ใส่ API key ของผู้ให้บริการ'
                }
                className={`${inputClass} pr-16`}
                required={retentionMode === 'session' || !savedSettings}
              />
              <button
                type="button"
                aria-label={apiKeyVisible ? 'ซ่อน API key' : 'แสดง API key'}
                aria-pressed={apiKeyVisible}
                onClick={() => setApiKeyVisible((visible) => !visible)}
                className="absolute inset-y-0 right-0 rounded-r-module px-3 font-body text-xs text-neutral/65 hover:text-neutral focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                {apiKeyVisible ? 'ซ่อน' : 'แสดง'}
              </button>
            </div>
          </Field>
          <Field label="เลือก Model ID">
            <div className="flex gap-2">
              <select
                value={model}
                onChange={(event) => setModel(event.target.value)}
                className={inputClass}
                required={retentionMode === 'session' || !savedSettings}
                disabled={
                  availableModels.length === 0 &&
                  (!savedSettings ||
                    savedSettings.base_url !== baseUrl ||
                    savedSettings.model !== model)
                }
              >
                <option value="">
                  {availableModels.length > 0
                    ? 'เลือกโมเดลที่ใช้ได้'
                    : 'กดโหลดโมเดลก่อน'}
                </option>
                {savedSettings &&
                savedSettings.base_url === baseUrl &&
                !availableModels.includes(savedSettings.model) && (
                    <option value={savedSettings.model}>
                      {savedSettings.model} (ตั้งค่าที่บันทึกไว้)
                    </option>
                  )}
                {availableModels.map((modelId) => (
                  <option key={modelId} value={modelId}>
                    {modelId}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={loadModels}
                disabled={
                  modelsBusy ||
                  (!apiKey.trim() &&
                    (!savedSettings || savedSettings.base_url !== baseUrl))
                }
                className="shrink-0 rounded-full border border-secondary px-3 font-body text-xs text-neutral hover:bg-tertiary disabled:opacity-50"
              >
                {modelsBusy ? 'กำลังโหลด…' : 'โหลดโมเดล'}
              </button>
            </div>
            <span className="font-body text-xs text-neutral/50">
              รายชื่อขึ้นอยู่กับ API key, สิทธิ์บัญชี และโมเดลที่ผู้ให้บริการเปิดให้ใช้
            </span>
          </Field>
          <Field label="การเก็บ API key">
            <select
              value={retentionMode}
              onChange={(event) =>
                setRetentionMode(event.target.value as RetentionMode)
              }
              className={inputClass}
            >
              <option value="session">ใช้ชั่วคราว ไม่บันทึก API key</option>
              <option value="until_deleted">เข้ารหัสเก็บไว้จนกว่าจะลบเอง</option>
              <option value="days">เข้ารหัสและลบอัตโนมัติ</option>
            </select>
          </Field>
          {retentionMode === 'session' && savedSettings && (
            <p className="font-body text-xs leading-relaxed text-gap sm:col-span-2">
              การเลือกโหมดชั่วคราวจะไม่ใช้ key ที่บันทึกไว้ แต่ key เดิมยังอยู่ในระบบ
              จนกด “ลบ API key ที่บันทึกไว้” ด้านบน
            </p>
          )}
          {retentionMode === 'days' && (
            <Field label="ลบ API key หลัง (วัน), สูงสุด 365 วัน">
              <input
                type="number"
                min={1}
                max={365}
                value={retentionDays}
                onChange={(event) =>
                  setRetentionDays(Number(event.target.value))
                }
                className={inputClass}
                required
              />
            </Field>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {retentionMode !== 'session' && (
            <button
              type="button"
              onClick={saveSettings}
              disabled={
                settingsActionBusy ||
                !baseUrl.trim() ||
                !model.trim() ||
                (retentionMode === 'days' &&
                  (!Number.isInteger(retentionDays) ||
                    retentionDays < 1 ||
                    retentionDays > 365)) ||
                (!apiKey.trim() &&
                  (!savedSettings || savedSettings.base_url !== baseUrl))
              }
              className="rounded-full bg-primary px-5 py-2.5 font-body text-sm font-semibold text-white hover:bg-primary-deep disabled:opacity-50"
            >
              {settingsActionBusy ? 'กำลังบันทึก…' : 'บันทึกการตั้งค่า API'}
            </button>
          )}
        </div>
        <p className="font-body text-xs leading-relaxed text-neutral/55">
          โหมดชั่วคราวเก็บ key ไว้ในหน่วยความจำของหน้านี้และส่งให้เซิร์ฟเวอร์ SkillForge
          เพื่อเรียก API เท่านั้น ไม่บันทึกลงฐานข้อมูล; โหมดบันทึกจะเข้ารหัสด้วยกุญแจ
          ฝั่งเซิร์ฟเวอร์ก่อนจัดเก็บ SkillForge ไม่ส่ง API key กลับมาแสดง
          แต่ข้อมูล prompt จะถูกส่งให้ผู้ให้บริการ AI ที่คุณเลือก โปรดตรวจนโยบายข้อมูลและค่าใช้บริการของผู้ให้บริการก่อนใช้
        </p>
        {settingsBusy && (
          <p className="font-body text-xs text-neutral/55">
            กำลังตรวจการตั้งค่าที่บันทึกไว้…
          </p>
        )}
        {notice && (
          <p role="status" className="font-body text-sm text-strength">
            {notice}
          </p>
        )}
        {settingsError && (
          <p role="alert" className="font-body text-sm text-gap">
            {settingsError}
          </p>
        )}
      </section>

      <div className="mb-5 flex gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setTab(item.id);
              setResult(null);
              setGenerationError(null);
            }}
            className={`rounded-module px-4 py-2 font-body text-sm transition-colors ${
              tab === item.id
                ? 'bg-primary text-white'
                : 'border border-secondary bg-white text-neutral hover:bg-secondary'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleGenerate}
        className="mb-6 space-y-3 rounded-module border border-secondary bg-white p-5"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="ชื่อ-นามสกุล">
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className={inputClass}
              required
            />
          </Field>
          {tab !== 'portfolio' && (
            <Field label="อีเมล">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClass}
                required
              />
            </Field>
          )}
          {tab === 'resume' && (
            <Field label="เบอร์โทร (ไม่บังคับ)">
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className={inputClass}
              />
            </Field>
          )}
          {tab === 'cover_letter' && (
            <>
              <Field label="บริษัทที่สมัคร">
                <input
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  className={inputClass}
                  required
                />
              </Field>
              <Field label="ชื่อผู้รับ (ไม่บังคับ)">
                <input
                  value={hiringManager}
                  onChange={(event) => setHiringManager(event.target.value)}
                  className={inputClass}
                />
              </Field>
            </>
          )}
          {tab === 'portfolio' && (
            <Field label="แท็กไลน์ (ไม่บังคับ)">
              <input
                value={tagline}
                onChange={(event) => setTagline(event.target.value)}
                className={inputClass}
              />
            </Field>
          )}
        </div>
        {tab === 'resume' && (
          <Field label="ผลงาน/ประสบการณ์เพิ่มเติม (บรรทัดละ 1 รายการ, ไม่บังคับ)">
            <textarea
              value={highlights}
              onChange={(event) => setHighlights(event.target.value)}
              className={`${inputClass} h-20`}
            />
          </Field>
        )}
        {tab === 'cover_letter' && (
          <Field label="ทำไมถึงสนใจบริษัท/ตำแหน่งนี้ (ไม่บังคับ)">
            <textarea
              value={whyInterested}
              onChange={(event) => setWhyInterested(event.target.value)}
              className={`${inputClass} h-20`}
            />
          </Field>
        )}
        <button
          type="submit"
          disabled={loading || !canGenerate()}
          className="rounded-module bg-primary px-5 py-2.5 font-body text-sm font-medium text-white transition-colors hover:bg-primary-deep disabled:opacity-50"
        >
          {loading ? 'กำลังสร้าง…' : 'สร้างด้วย AI ของฉัน'}
        </button>
        {!canGenerate() && !settingsBusy && (
          <p className="font-body text-xs text-neutral/55">
            {retentionMode === 'session'
              ? 'กรอก Base URL, API key และ Model ID หรือบันทึกการตั้งค่าก่อนสร้างเอกสาร'
              : 'บันทึกการตั้งค่า API ให้เรียบร้อยก่อนสร้างเอกสาร'}
          </p>
        )}
        {generationError && (
          <p role="alert" className="font-body text-sm text-gap">
            {generationError}
          </p>
        )}
      </form>

      {result && (
        <div className="mb-8 rounded-module border border-secondary bg-white p-5">
          <h3 className="mb-3 font-display font-semibold text-neutral">
            {result.title}
          </h3>
          <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed text-neutral">
            {result.content_markdown}
          </pre>
        </div>
      )}

      {documents.length > 0 && (
        <div>
          <h2 className="mb-3 font-display font-semibold text-neutral">
            ประวัติที่เคยสร้าง
          </h2>
          <div className="space-y-2">
            {documents.map((document) => (
              <details
                key={document.id}
                className="rounded-module border border-secondary bg-white p-4"
              >
                <summary className="cursor-pointer font-body text-sm text-neutral">
                  {document.title}
                </summary>
                <pre className="mt-3 whitespace-pre-wrap font-body text-xs leading-relaxed text-neutral/70">
                  {document.content_markdown}
                </pre>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const inputClass =
  'w-full rounded-module border border-secondary bg-white px-3 py-2 font-body text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-primary/40';

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-body text-xs text-neutral/50">{label}</span>
      {children}
    </label>
  );
}
