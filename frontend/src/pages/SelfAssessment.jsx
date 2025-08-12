import React, { useMemo, useState } from 'react';

export default function SelfAssessment(){
  // Dummy questionnaire
  const questions = useMemo(() => ([
    {
      id: 'q1',
      text: 'Do you maintain an up-to-date Record of Processing Activities (RoPA)?',
      options: [
        { label: 'No', value: 0 },
        { label: 'Partially', value: 1 },
        { label: 'Yes', value: 2 },
      ],
    },
    {
      id: 'q2',
      text: 'Is there a defined process to capture and manage user consents?',
      options: [
        { label: 'No', value: 0 },
        { label: 'Partially', value: 1 },
        { label: 'Yes', value: 2 },
      ],
    },
    {
      id: 'q3',
      text: 'Do you have a DSAR workflow with SLAs and audit trails?',
      options: [
        { label: 'No', value: 0 },
        { label: 'Partially', value: 1 },
        { label: 'Yes', value: 2 },
      ],
    },
    {
      id: 'q4',
      text: 'Are cross-border data transfers governed by contracts and assessments?',
      options: [
        { label: 'No', value: 0 },
        { label: 'Partially', value: 1 },
        { label: 'Yes', value: 2 },
      ],
    },
    {
      id: 'q5',
      text: 'Do you conduct periodic privacy impact assessments (DPIA/PIA)?',
      options: [
        { label: 'No', value: 0 },
        { label: 'Sometimes', value: 1 },
        { label: 'Regularly', value: 2 },
      ],
    },
    {
      id: 'q6',
      text: 'Is your privacy policy updated and easily accessible to users?',
      options: [
        { label: 'No', value: 0 },
        { label: 'Partially', value: 1 },
        { label: 'Yes', value: 2 },
      ],
    },
    {
      id: 'q7',
      text: 'Do you have breach detection, reporting, and response procedures?',
      options: [
        { label: 'No', value: 0 },
        { label: 'Partially', value: 1 },
        { label: 'Yes', value: 2 },
      ],
    },
    {
      id: 'q8',
      text: 'Are vendors and processors assessed for privacy/security controls?',
      options: [
        { label: 'No', value: 0 },
        { label: 'Partially', value: 1 },
        { label: 'Yes', value: 2 },
      ],
    },
  ]), []);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [id]: value }
  const [finished, setFinished] = useState(false);

  const total = questions.length;
  const current = questions[index];
  const progressPct = Math.round(((finished ? total : index) / total) * 100);

  const selected = answers[current?.id];

  function onSelect(val){
    setAnswers(prev => ({ ...prev, [current.id]: val }));
  }

  function onPrev(){
    if (index > 0) setIndex(i => i - 1);
  }

  function onNext(){
    if (selected === undefined) return; // require an answer to proceed
    if (index < total - 1){
      setIndex(i => i + 1);
    } else {
      setFinished(true);
    }
  }

  function onRestart(){
    setAnswers({});
    setIndex(0);
    setFinished(false);
  }

  const score = useMemo(() => {
    const max = total * 2; // highest per question
    const sum = Object.values(answers).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);
    const pct = max === 0 ? 0 : Math.round((sum / max) * 100);
    return { sum, max, pct };
  }, [answers, total]);

  const recommendations = useMemo(() => {
    if (score.pct >= 80) {
      return [
        'Formalize ongoing DPIA cadence and third-party audit reviews.',
        'Automate DSAR fulfillment with templates and SLA tracking.',
        'Implement continuous monitoring and periodic internal audits.',
      ];
    } else if (score.pct >= 50) {
      return [
        'Strengthen consent capture and withdrawal flows end-to-end.',
        'Close gaps in DSAR workflows (assignment, notes, escalation).',
        'Document cross-border transfer assessments and safeguards.',
      ];
    } else {
      return [
        'Establish a baseline privacy policy and RoPA immediately.',
        'Implement consent banner and preferences management.',
        'Define DSAR intake and response procedures with owners.',
      ];
    }
  }, [score.pct]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Self-Assessment</h1>
        <p className="mt-1 text-sm text-gray-600">Answer the questions to estimate your privacy readiness</p>
      </div>

      {/* Progress */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
          <span>Progress</span>
          <span>{finished ? 100 : Math.round(((index+1) / total) * 100)}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-100">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all"
            style={{ width: `${finished ? 100 : Math.round(((index+1)/total)*100)}%` }}
          />
        </div>
      </div>

      {/* Content */}
      {!finished ? (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Question {index + 1} of {total}</div>
          <div className="mt-2 text-lg font-semibold text-gray-900">{current.text}</div>

          <div className="mt-4 grid gap-2">
            {current.options.map((opt, i) => {
              const inputId = `${current.id}_${i}`;
              return (
                <label key={inputId} htmlFor={inputId} className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 p-3 hover:bg-gray-50">
                  <input
                    type="radio"
                    id={inputId}
                    name={current.id}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-600"
                    checked={selected === opt.value}
                    onChange={() => onSelect(opt.value)}
                  />
                  <span className="text-sm text-gray-800">{opt.label}</span>
                </label>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button onClick={onPrev} disabled={index===0} className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">Previous</button>
            <button onClick={onNext} disabled={selected===undefined} className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{index === total - 1 ? 'Finish' : 'Next'}</button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-green-900 ring-1 ring-inset ring-green-200">
            <div className="text-sm font-medium">Estimated Readiness</div>
            <div className="mt-1 text-3xl font-semibold">{score.pct}%</div>
            <div className="mt-1 text-sm text-green-800">Score {score.sum} out of {score.max}</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="text-base font-semibold text-gray-900">Recommended next steps</div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
              {recommendations.map((r, idx) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
            <div className="mt-5">
              <button onClick={onRestart} className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Restart assessment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
