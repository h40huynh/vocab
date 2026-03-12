export const css = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Outfit', sans-serif; background: #0f1117; color: #e8e8f0; min-height: 100vh; }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #1a1d27; } ::-webkit-scrollbar-thumb { background: #3a3d52; border-radius: 3px; }
  .app { display: flex; height: 100vh; overflow: hidden; }

  /* Sidebar */
  .sidebar { width: 240px; min-width: 240px; background: #13151f; border-right: 1px solid #232537; display: flex; flex-direction: column; overflow: hidden; }
  .sidebar-head { padding: 18px 16px 12px; border-bottom: 1px solid #232537; }
  .sidebar-head h1 { font-family: 'Lora', serif; font-size: 1.1rem; font-weight: 700; color: #c9d1ff; letter-spacing: -0.3px; }
  .sidebar-head p { font-size: 0.7rem; color: #5a5e7a; margin-top: 2px; }
  .sidebar-files { flex: 1; overflow-y: auto; padding: 10px 8px; }
  .file-item { display: flex; align-items: center; gap: 8px; padding: 9px 10px; border-radius: 9px; cursor: pointer; margin-bottom: 2px; transition: background 0.15s; position: relative; }
  .file-item:hover { background: #1e2030; }
  .topic-header { display: flex; align-items: center; gap: 8px; padding: 8px 10px 5px; margin-top: 4px; cursor: pointer; border-radius: 8px; transition: background 0.15s; }
  .topic-header:hover { background: #1a1d27; }
  .topic-header .t-name { font-size: 0.72rem; font-weight: 700; color: #7a7fa0; text-transform: uppercase; letter-spacing: 0.6px; flex: 1; }
  .topic-header .t-count { font-size: 0.65rem; color: #3a3d52; }
  .topic-header .t-arrow { font-size: 0.6rem; color: #3a3d52; transition: transform 0.2s; }
  .topic-header.collapsed .t-arrow { transform: rotate(-90deg); }
  .topic-active-bar { width: 3px; height: 16px; border-radius: 2px; background: #6366f1; flex-shrink: 0; }
  .file-item.topic-child { padding-left: 22px; }
  .upload-in-topic { display: flex; align-items: center; gap: 6px; padding: 5px 10px 5px 22px; font-size: 0.72rem; color: #3a3d52; cursor: pointer; border-radius: 8px; transition: all 0.15s; }
  .upload-in-topic:hover { color: #6366f1; background: #1a1d27; }
  .file-item.active { background: #252847; }
  .file-item .emoji { font-size: 1rem; flex-shrink: 0; }
  .file-item .name { font-size: 0.8rem; font-weight: 500; color: #c0c4e0; flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .file-item .count { font-size: 0.65rem; color: #5a5e7a; flex-shrink: 0; }
  .file-actions { display: none; gap: 3px; } .file-item:hover .file-actions { display: flex; }
  .file-actions button { background: none; border: none; cursor: pointer; font-size: 0.8rem; padding: 2px 4px; border-radius: 4px; color: #5a5e7a; transition: color 0.15s; }
  .file-actions button:hover { color: #c9d1ff; }
  .sidebar-footer { padding: 12px 8px; border-top: 1px solid #232537; display: flex; flex-direction: column; gap: 6px; }
  .btn-sidebar { display: flex; align-items: center; gap: 8px; padding: 9px 12px; border-radius: 9px; border: 1px dashed #3a3d52; background: none; color: #7a7fa0; font-family: 'Outfit', sans-serif; font-size: 0.78rem; cursor: pointer; width: 100%; transition: all 0.15s; }
  .btn-sidebar:hover { border-color: #6366f1; color: #a5b4fc; background: #1e2030; }

  /* Main */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .topbar { padding: 14px 20px; border-bottom: 1px solid #232537; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; background: #13151f; }
  .file-title { font-family: 'Lora', serif; font-size: 1.2rem; font-weight: 600; color: #c9d1ff; display: flex; align-items: center; gap: 8px; }
  .file-subtitle { font-size: 0.72rem; color: #5a5e7a; margin-top: 1px; }
  .search-wrap { flex: 1; min-width: 160px; max-width: 320px; position: relative; }
  .search-input { width: 100%; padding: 8px 12px 8px 34px; background: #1a1d27; border: 1px solid #2d3045; border-radius: 8px; color: #e8e8f0; font-family: 'Outfit', sans-serif; font-size: 0.82rem; outline: none; transition: border-color 0.15s; }
  .search-input:focus { border-color: #6366f1; }
  .search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-size: 0.9rem; color: #5a5e7a; pointer-events: none; }
  .nav-tabs { display: flex; gap: 4px; }
  .tab { padding: 7px 14px; border-radius: 8px; border: none; background: none; color: #5a5e7a; font-family: 'Outfit', sans-serif; font-size: 0.78rem; font-weight: 500; cursor: pointer; transition: all 0.15s; }
  .tab:hover { color: #c9d1ff; background: #1e2030; }
  .tab.active { background: #252847; color: #a5b4fc; }
  .type-filters { display: flex; gap: 4px; padding: 10px 20px; border-bottom: 1px solid #1e2030; flex-wrap: wrap; }
  .type-chip { padding: 4px 11px; border-radius: 20px; border: 1px solid #2d3045; background: none; font-family: 'Outfit', sans-serif; font-size: 0.7rem; font-weight: 500; cursor: pointer; transition: all 0.15s; color: #7a7fa0; }
  .type-chip.active, .type-chip:hover { border-color: #6366f1; color: #a5b4fc; background: #1e2030; }
  .content { flex: 1; overflow-y: auto; padding: 20px; }

  /* Clusters */
  .cluster-stack { display: flex; flex-direction: column; gap: 18px; }
  .cluster-section { border: 1px solid #232537; border-radius: 12px; padding: 12px; background: #12141d; }
  .cluster-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 10px; padding: 0 2px; }
  .cluster-title { font-size: 0.76rem; font-weight: 700; color: #a5b4fc; text-transform: uppercase; letter-spacing: 0.45px; }
  .cluster-count { font-size: 0.68rem; color: #5a5e7a; }

  /* Cards */
  .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
  .vocab-card { background: #1a1d27; border: 1px solid #2d3045; border-radius: 12px; padding: 14px 16px; cursor: pointer; transition: all 0.18s; position: relative; }
  .vocab-card:hover { border-color: #4a4f7a; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
  .vocab-card.flipped { background: #1e2038; border-color: #6366f1; }
  .card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
  .card-en { font-family: 'Lora', serif; font-size: 1.05rem; font-weight: 600; color: #e8eaff; line-height: 1.3; }
  .card-ph { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: #5a5e7a; margin-top: 3px; }
  .sense-chip { display: inline-flex; margin-top: 6px; font-size: 0.62rem; color: #a5b4fc; background: #1f2440; border: 1px solid #33395e; border-radius: 999px; padding: 2px 8px; }
  .grammar-badge { display: inline-block; padding: 2px 8px; border-radius: 5px; font-size: 0.62rem; font-weight: 700; text-transform: lowercase; letter-spacing: 0.2px; color: #ffd89a; background: #3b2d10; border: 1px solid #6b5220; flex-shrink: 0; }
  .card-def-en { font-size: 0.8rem; color: #d7dcff; margin-top: 6px; line-height: 1.45; }
  .card-def-vi { font-size: 0.82rem; color: #9ca3c0; margin-top: 4px; line-height: 1.45; }
  .card-ex { font-size: 0.78rem; color: #c0c4e0; line-height: 1.55; margin-top: 10px; padding-top: 10px; border-top: 1px solid #2d3045; font-style: italic; }
  .md-label { font-size: 0.67rem; font-style: normal; font-weight: 700; text-transform: uppercase; letter-spacing: 0.45px; color: #7a7fa0; margin-bottom: 6px; }
  .md-content { font-style: normal; }
  .md-content p { margin: 0 0 8px; }
  .md-content p:last-child { margin-bottom: 0; }
  .md-content ul, .md-content ol { margin: 4px 0 8px 18px; padding: 0; }
  .md-content li { margin: 2px 0; }
  .md-content code { font-family: 'DM Mono', monospace; font-size: 0.72rem; background: #121521; color: #c9d1ff; padding: 1px 4px; border-radius: 4px; }
  .md-content pre { background: #0f1117; border: 1px solid #2d3045; border-radius: 8px; padding: 8px 10px; overflow-x: auto; margin: 6px 0 8px; }
  .md-content pre code { background: transparent; padding: 0; }
  .md-compact p { margin: 0; }
  .md-compact ul, .md-compact ol { margin: 2px 0 0 16px; }
  .md-compact li { margin: 1px 0; }
  .type-badge { display: inline-block; padding: 2px 8px; border-radius: 5px; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; flex-shrink: 0; }
  .star-btn { background: none; border: none; cursor: pointer; font-size: 1rem; padding: 2px; line-height: 1; transition: transform 0.15s; flex-shrink: 0; }
  .star-btn:hover { transform: scale(1.2); }
  .card-actions { display: flex; gap: 4px; margin-top: 10px; }
  .card-action-btn { background: none; border: 1px solid #2d3045; color: #5a5e7a; font-size: 0.68rem; padding: 3px 8px; border-radius: 5px; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.15s; }
  .card-action-btn:hover { border-color: #6366f1; color: #a5b4fc; }
  .flip-hint { font-size: 0.62rem; color: #3a3d52; text-align: right; margin-top: 6px; }

  /* List */
  .list-table { width: 100%; border-collapse: collapse; }
  .list-table th { text-align: left; padding: 10px 14px; font-size: 0.72rem; font-weight: 600; color: #5a5e7a; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #2d3045; position: sticky; top: 0; background: #0f1117; }
  .list-table td { padding: 11px 14px; font-size: 0.83rem; border-bottom: 1px solid #1e2030; vertical-align: top; }
  .list-table tr:hover td { background: #1a1d27; }
  .list-group-row td { padding: 8px 14px; font-size: 0.7rem; font-weight: 700; color: #7a7fa0; background: #151826; text-transform: uppercase; letter-spacing: 0.45px; border-bottom: 1px solid #2d3045; }
  .td-en { font-family: 'Lora', serif; font-weight: 600; color: #e8eaff; }
  .td-ph { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: #5a5e7a; }
  .td-def-en { color: #d7dcff; }
  .td-vi { color: #9ca3c0; }
  .td-ex { color: #7a7fa0; font-style: italic; font-size: 0.78rem; }
  .quiz-example { text-align: left; color: #7a7fa0; font-size: 0.82rem; border: 1px solid #2d3045; border-radius: 10px; padding: 10px 12px; background: #151826; }

  /* Add form */
  .add-panel { max-width: 600px; }
  .panel-title { font-family: 'Lora', serif; font-size: 1.3rem; font-weight: 600; color: #c9d1ff; margin-bottom: 20px; }
  .form-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
  .form-group { display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 160px; }
  .form-group.full { flex-basis: 100%; }
  .form-label { font-size: 0.72rem; font-weight: 600; color: #5a5e7a; text-transform: uppercase; letter-spacing: 0.5px; }
  .form-input, .form-select, .form-textarea { background: #1a1d27; border: 1px solid #2d3045; border-radius: 8px; color: #e8e8f0; font-family: 'Outfit', sans-serif; font-size: 0.85rem; padding: 9px 12px; outline: none; transition: border-color 0.15s; }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: #6366f1; }
  .form-select option { background: #1a1d27; }
  .form-textarea { resize: vertical; min-height: 70px; }
  .btn-primary { background: #6366f1; color: white; border: none; border-radius: 8px; padding: 10px 22px; font-family: 'Outfit', sans-serif; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: background 0.15s; }
  .btn-primary:hover { background: #5254cc; }
  .btn-secondary { background: #1e2030; color: #a5b4fc; border: 1px solid #3a3d52; border-radius: 8px; padding: 10px 18px; font-family: 'Outfit', sans-serif; font-size: 0.83rem; cursor: pointer; transition: all 0.15s; }
  .btn-secondary:hover { background: #252847; }
  .divider { border: none; border-top: 1px solid #2d3045; margin: 28px 0; }
  .new-file-section { background: #1a1d27; border: 1px solid #2d3045; border-radius: 12px; padding: 20px; }
  .new-file-section h3 { font-size: 0.9rem; font-weight: 600; color: #c9d1ff; margin-bottom: 14px; }

  /* Quiz */
  .quiz-wrap { max-width: 560px; margin: 0 auto; }
  .quiz-progress { font-size: 0.78rem; color: #5a5e7a; margin-bottom: 16px; display: flex; justify-content: space-between; }
  .quiz-prog-bar { height: 3px; background: #2d3045; border-radius: 2px; margin-bottom: 20px; }
  .quiz-prog-fill { height: 100%; background: #6366f1; border-radius: 2px; transition: width 0.3s; }
  .quiz-card { background: #1a1d27; border: 1px solid #2d3045; border-radius: 16px; padding: 28px; margin-bottom: 20px; text-align: center; }
  .quiz-question { font-size: 0.72rem; color: #5a5e7a; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
  .quiz-word { font-family: 'Lora', serif; font-size: 1.8rem; font-weight: 700; color: #e8eaff; }
  .quiz-ph { font-family: 'DM Mono', monospace; font-size: 0.8rem; color: #5a5e7a; margin-top: 6px; }
  .quiz-sense-line { margin-top: 8px; font-size: 0.8rem; color: #9ca3c0; line-height: 1.5; }
  .quiz-choices { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .quiz-choice { padding: 13px 16px; background: #1a1d27; border: 1.5px solid #2d3045; border-radius: 10px; color: #c0c4e0; font-family: 'Outfit', sans-serif; font-size: 0.85rem; cursor: pointer; transition: all 0.15s; text-align: left; }
  .quiz-choice:hover:not(:disabled) { border-color: #6366f1; color: #a5b4fc; }
  .quiz-choice.correct { border-color: #22c55e; background: #0f2d1e; color: #4ade80; }
  .quiz-choice.wrong { border-color: #ef4444; background: #2d0f0f; color: #f87171; }
  .quiz-result { text-align: center; padding: 40px 20px; }
  /* SR rating buttons */
  .sr-rating { display: flex; gap: 10px; justify-content: center; margin-top: 16px; flex-wrap: wrap; }
  .sr-btn { padding: 10px 22px; border-radius: 10px; border: 1.5px solid; font-family: 'Outfit', sans-serif; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.15s; background: none; }
  .sr-btn-0 { border-color: #ef4444; color: #f87171; } .sr-btn-0:hover { background: #2d0f0f; }
  .sr-btn-1 { border-color: #f97316; color: #fb923c; } .sr-btn-1:hover { background: #2d1a0f; }
  .sr-btn-2 { border-color: #eab308; color: #facc15; } .sr-btn-2:hover { background: #2d270f; }
  .sr-btn-3 { border-color: #22c55e; color: #4ade80; } .sr-btn-3:hover { background: #0f2d1e; }
  .sr-label { font-size: 0.68rem; display: block; margin-top: 3px; opacity: 0.7; font-weight: 400; }
  .sr-badge { display: inline-flex; align-items: center; gap: 5px; background: #1a2d1a; border: 1px solid #22c55e; border-radius: 8px; padding: 4px 10px; font-size: 0.72rem; color: #4ade80; font-weight: 600; }
  .sr-badge-warn { background: #2d2200; border-color: #eab308; color: #facc15; }
  .due-item { display: flex; align-items: center; justify-content: space-between; padding: 7px 10px; border-radius: 8px; font-size: 0.8rem; }
  .due-item:hover { background: #1e2030; }
  .due-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .quiz-score { font-family: 'Lora', serif; font-size: 3.5rem; font-weight: 700; color: #6366f1; }
  .quiz-score-label { font-size: 0.85rem; color: #5a5e7a; margin-top: 4px; }

  /* Manage */
  .remote-loader-panel { background: #1a1d27; border: 1px solid #2d3045; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
  .remote-loader-head { margin-bottom: 10px; }
  .remote-loader-title { font-family: 'Lora', serif; font-size: 0.95rem; font-weight: 600; color: #c9d1ff; }
  .remote-loader-sub { font-size: 0.74rem; color: #5a5e7a; margin-top: 2px; }
  .remote-loader-row { display: flex; gap: 8px; align-items: center; }
  .remote-url-input { flex: 1; min-width: 220px; }
  .remember-url-check { display: inline-flex; align-items: center; gap: 8px; margin-top: 10px; font-size: 0.76rem; color: #9ca3c0; user-select: none; }
  .remember-url-check input { accent-color: #6366f1; }
  .saved-urls-wrap { margin-top: 12px; border-top: 1px solid #2d3045; padding-top: 10px; }
  .saved-urls-title { font-size: 0.72rem; color: #7a7fa0; text-transform: uppercase; letter-spacing: 0.45px; margin-bottom: 8px; }
  .saved-urls-list { display: flex; flex-direction: column; gap: 8px; max-height: 170px; overflow-y: auto; padding-right: 2px; }
  .saved-url-item { display: flex; align-items: center; gap: 8px; background: #151826; border: 1px solid #2d3045; border-radius: 8px; padding: 8px; }
  .saved-url-text { flex: 1; min-width: 0; font-size: 0.75rem; color: #c0c4e0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .saved-url-actions { display: flex; gap: 6px; }
  .saved-urls-empty { font-size: 0.78rem; color: #5a5e7a; }
  .manage-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
  .manage-card { background: #1a1d27; border: 1px solid #2d3045; border-radius: 12px; padding: 18px; }
  .manage-card-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .manage-card-emoji { font-size: 1.6rem; }
  .manage-card-title { font-family: 'Lora', serif; font-size: 1rem; font-weight: 600; color: #c9d1ff; }
  .manage-card-sub { font-size: 0.72rem; color: #5a5e7a; }
  .manage-card-actions { display: flex; gap: 6px; flex-wrap: wrap; }
  .btn-sm { padding: 5px 12px; border-radius: 6px; font-size: 0.72rem; font-family: 'Outfit', sans-serif; cursor: pointer; border: 1px solid; font-weight: 500; transition: all 0.15s; }
  .btn-sm:disabled, .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
  .btn-edit { background: none; border-color: #3a3d52; color: #7a7fa0; } .btn-edit:hover { border-color: #6366f1; color: #a5b4fc; background: #1e2030; }
  .btn-download { background: none; border-color: #3a3d52; color: #7a7fa0; } .btn-download:hover { border-color: #22c55e; color: #4ade80; background: #0f2d1e; }
  .btn-delete { background: none; border-color: #3a3d52; color: #7a7fa0; } .btn-delete:hover { border-color: #ef4444; color: #f87171; background: #2d0f0f; }
  .built-in-badge { font-size: 0.6rem; background: #252847; color: #6366f1; padding: 2px 6px; border-radius: 4px; font-weight: 600; }

  /* Raw editor */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
  .modal { background: #1a1d27; border: 1px solid #2d3045; border-radius: 16px; width: 100%; max-width: 700px; max-height: 85vh; display: flex; flex-direction: column; }
  .modal-head { padding: 18px 20px; border-bottom: 1px solid #2d3045; display: flex; align-items: center; justify-content: space-between; }
  .modal-head h3 { font-family: 'Lora', serif; font-size: 1rem; color: #c9d1ff; }
  .modal-close { background: none; border: none; color: #5a5e7a; font-size: 1.2rem; cursor: pointer; }
  .modal-close:hover { color: #e8e8f0; }
  .modal-body { flex: 1; overflow-y: auto; padding: 16px 20px; }
  .modal-foot { padding: 14px 20px; border-top: 1px solid #2d3045; display: flex; gap: 10px; justify-content: flex-end; }
  .raw-editor { width: 100%; min-height: 400px; background: #0f1117; border: 1px solid #2d3045; border-radius: 8px; color: #c0c4e0; font-family: 'DM Mono', monospace; font-size: 0.78rem; padding: 14px; outline: none; resize: vertical; line-height: 1.7; }
  .raw-editor:focus { border-color: #6366f1; }
  .format-hint { background: #0f1117; border: 1px solid #2d3045; border-radius: 8px; padding: 12px 14px; margin-bottom: 12px; font-family: 'DM Mono', monospace; font-size: 0.72rem; color: #5a5e7a; line-height: 1.7; }
  .format-hint span { color: #6366f1; }

  /* Toast */
  .toast { position: fixed; bottom: 24px; right: 24px; background: #252847; border: 1px solid #6366f1; border-radius: 10px; padding: 12px 18px; font-size: 0.83rem; color: #c9d1ff; z-index: 999; box-shadow: 0 4px 20px rgba(0,0,0,0.4); animation: slideUp 0.25s ease; }
  .toast.error { border-color: #ef4444; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  /* Empty */
  .empty { text-align: center; padding: 60px 20px; color: #3a3d52; }
  .empty-icon { font-size: 3rem; margin-bottom: 12px; }
  .empty-text { font-size: 0.85rem; }

  @media (max-width: 700px) {
    .sidebar { width: 200px; min-width: 200px; }
    .cards-grid { grid-template-columns: 1fr; }
    .quiz-choices { grid-template-columns: 1fr; }
    .remote-loader-row { flex-direction: column; align-items: stretch; }
  }
`;
