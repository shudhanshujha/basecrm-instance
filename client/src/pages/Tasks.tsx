import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus, ChevronLeft, ChevronRight, Calendar, Clock,
  Loader2, Trash2, CheckCircle2, Circle, AlertCircle,
  Flag, Filter, Search, X, List, LayoutGrid,
  User, Link, Bell, MoreHorizontal, Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../lib/axios';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths, parseISO } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  category?: string;
  reminderAt?: string;
  dealId?: string;
  clientId?: string;
  invoiceId?: string;
  assignedTo?: string;
  completedAt?: string;
  createdAt: string;
}

const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30',
  MEDIUM: 'bg-success/20 text-success border-success/30',
  HIGH: 'bg-warning/20 text-warning border-warning/30',
  URGENT: 'bg-danger/20 text-danger border-danger/30',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-text-muted/20 text-text-muted',
  IN_PROGRESS: 'bg-accent-blue/20 text-accent-blue',
  COMPLETED: 'bg-success/20 text-success',
  CANCELLED: 'bg-danger/20 text-danger',
};

const Tasks: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
    status: 'PENDING',
    category: '',
    reminderAt: '',
    dealId: '',
    clientId: '',
  });

  useEffect(() => {
    fetchTasks();
  }, [currentDate]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const m = currentDate.getMonth() + 1;
      const y = currentDate.getFullYear();
      const res = await api.get('/tasks', { params: { month: m, year: y } });
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentDate]);

  const dayTasks = useMemo(() => {
    return tasks.filter(t => t.dueDate && isSameDay(parseISO(t.dueDate), selectedDate));
  }, [tasks, selectedDate]);

  const getTaskCountForDay = (day: Date) => {
    return tasks.filter(t => t.dueDate && isSameDay(parseISO(t.dueDate), day)).length;
  };

  const getDayOverdueCount = (day: Date) => {
    return tasks.filter(t =>
      t.dueDate && isSameDay(parseISO(t.dueDate), day) &&
      t.status !== 'COMPLETED' && t.status !== 'CANCELLED' &&
      parseISO(t.dueDate) < new Date()
    ).length;
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length;
    const completed = tasks.filter(t => t.status === 'COMPLETED').length;
    const overdue = tasks.filter(t =>
      t.dueDate && t.status !== 'COMPLETED' && t.status !== 'CANCELLED' &&
      parseISO(t.dueDate) < new Date()
    ).length;
    return { total, pending, completed, overdue };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let list = dayTasks;
    if (filterStatus !== 'ALL') {
      list = list.filter(t => t.status === filterStatus);
    }
    return list.sort((a, b) => {
      const pOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      return (pOrder[a.priority] ?? 2) - (pOrder[b.priority] ?? 2);
    });
  }, [dayTasks, filterStatus]);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const openAddModal = (date?: Date) => {
    setEditingTask(null);
    setForm({
      title: '',
      description: '',
      dueDate: date ? format(date, "yyyy-MM-dd'T'HH:mm") : format(selectedDate, "yyyy-MM-dd'T'HH:mm"),
      priority: 'MEDIUM',
      status: 'PENDING',
      category: '',
      reminderAt: '',
      dealId: '',
      clientId: '',
    });
    setShowModal(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate ? format(parseISO(task.dueDate), "yyyy-MM-dd'T'HH:mm") : '',
      priority: task.priority,
      status: task.status,
      category: task.category || '',
      reminderAt: task.reminderAt ? format(parseISO(task.reminderAt), "yyyy-MM-dd'T'HH:mm") : '',
      dealId: task.dealId || '',
      clientId: task.clientId || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Task title is required');
      return;
    }
    try {
      const payload: Record<string, any> = {};
      if (form.title) payload.title = form.title;
      if (form.description) payload.description = form.description;
      if (form.dueDate) payload.dueDate = form.dueDate;
      if (form.priority) payload.priority = form.priority;
      if (form.status) payload.status = form.status;
      if (form.category) payload.category = form.category;
      if (form.reminderAt) payload.reminderAt = form.reminderAt;
      if (form.dealId) payload.dealId = form.dealId;
      if (form.clientId) payload.clientId = form.clientId;

      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, payload);
        toast.success('Task updated');
      } else {
        await api.post('/tasks', payload);
        toast.success('Task created');
      }
      setShowModal(false);
      fetchTasks();
    } catch (error) {
      toast.error('Failed to save task');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
      await api.put(`/tasks/${task.id}`, { status: newStatus });
      toast.success(newStatus === 'COMPLETED' ? 'Task completed' : 'Task reopened');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">Schedule & Tasks</h1>
          <p className="text-[13px] text-text-muted mt-2 uppercase font-bold tracking-[3px] flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-accent-blue rounded-full animate-pulse" />
            {stats.pending} PENDING · {stats.overdue} OVERDUE · SYSTEM ACTIVE
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20' : 'text-text-muted hover:text-text-primary'}`}
            ><Calendar size={18} /></button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20' : 'text-text-muted hover:text-text-primary'}`}
            ><List size={18} /></button>
          </div>
          <button onClick={() => openAddModal()} className="btn-primary text-[14px] px-6 flex items-center gap-2 shadow-xl shadow-accent-purple/20">
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Total Tasks', val: stats.total, color: 'text-text-primary' },
          { label: 'Pending / Active', val: stats.pending, color: 'text-accent-blue' },
          { label: 'Completed', val: stats.completed, color: 'text-success' },
          { label: 'Overdue', val: stats.overdue, color: 'text-danger' },
        ].map((stat, i) => (
          <div key={i} className="card border-white/5 bg-bg-surface/30">
            <span className="text-[12px] text-text-muted uppercase font-black tracking-[2px]">{stat.label}</span>
            <span className={`text-2xl font-black mt-2 block ${stat.color}`}>{stat.val}</span>
          </div>
        ))}
      </div>

      {viewMode === 'calendar' ? (
        <div className="card border-white/5 bg-bg-surface/30 p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-white/5 rounded-xl text-text-muted hover:text-text-primary transition-all">
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-xl font-black text-text-primary uppercase tracking-tight">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <button onClick={handleNextMonth} className="p-2 hover:bg-white/5 rounded-xl text-text-muted hover:text-text-primary transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="text-[12px] font-black uppercase tracking-widest text-accent-blue hover:underline"
            >Today</button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-[12px] font-black text-text-muted uppercase tracking-widest py-2">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {days.map((day, idx) => {
              const count = getTaskCountForDay(day);
              const overdue = getDayOverdueCount(day);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrent = isToday(day);
              const inMonth = isSameMonth(day, currentDate);

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  onDoubleClick={() => openAddModal(day)}
                  className={`
                    relative min-h-[90px] p-2 border border-white/5 transition-all group
                    ${isSelected ? 'bg-accent-blue/10 border-accent-blue/40 shadow-inner' : 'hover:bg-white/5'}
                    ${!inMonth ? 'opacity-30' : ''}
                  `}
                >
                  <span className={`
                    inline-flex items-center justify-center w-8 h-8 rounded-full text-[14px] font-bold
                    ${isCurrent ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/30' : ''}
                    ${isSelected && !isCurrent ? 'bg-accent-blue/20 text-accent-blue' : ''}
                    ${!isSelected && !isCurrent ? 'text-text-primary' : ''}
                  `}>
                    {format(day, 'd')}
                  </span>
                  {count > 0 && (
                    <div className="mt-1 space-y-0.5">
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${overdue > 0 ? 'bg-danger' : 'bg-accent-blue'}`} />
                        <span className="text-[10px] font-black text-text-muted">{count} task{count > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="card border-white/5 bg-bg-surface/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-[15px] font-black text-text-primary uppercase tracking-[3px]">
              {viewMode === 'calendar'
                ? `Tasks · ${format(selectedDate, 'dd MMM yyyy')}`
                : `All Tasks · ${format(currentDate, 'MMMM yyyy')}`}
            </h2>
            {viewMode === 'calendar' && (
              <span className="text-[12px] text-text-muted font-black uppercase tracking-widest">
                {dayTasks.length} item{dayTasks.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  filterStatus === s
                    ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30'
                    : 'text-text-muted hover:text-text-primary border border-transparent'
                }`}
              >{s === 'IN_PROGRESS' ? 'ACTIVE' : s}</button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center"
            >
              <Loader2 className="animate-spin mx-auto text-accent-blue" size={32} />
            </motion.div>
          ) : viewMode === 'calendar' ? (
            <motion.div
              key="day-tasks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {filteredTasks.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <Calendar size={28} className="text-text-muted" />
                  </div>
                  <p className="text-[16px] font-black text-text-muted uppercase tracking-widest">No Tasks Scheduled</p>
                  <p className="text-[13px] text-text-muted mt-2 font-bold">Double-click a date or press New Task</p>
                </div>
              ) : (
                filteredTasks.map(task => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-accent-blue/20 transition-all group"
                  >
                    <button
                      onClick={() => handleToggleComplete(task)}
                      className={`mt-0.5 shrink-0 transition-all ${task.status === 'COMPLETED' ? 'text-success' : 'text-text-muted hover:text-accent-blue'}`}
                    >
                      {task.status === 'COMPLETED' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className={`text-[16px] font-bold ${task.status === 'COMPLETED' ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                          {task.title}
                        </h3>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[task.priority]}`}>
                          {task.priority}
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${STATUS_COLORS[task.status]}`}>
                          {task.status === 'IN_PROGRESS' ? 'ACTIVE' : task.status}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-[14px] text-text-muted mt-1.5 line-clamp-2">{task.description}</p>
                      )}

                      <div className="flex items-center gap-4 mt-2.5">
                        {task.dueDate && (
                          <span className={`flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-widest ${
                            task.status !== 'COMPLETED' && parseISO(task.dueDate) < new Date()
                              ? 'text-danger'
                              : 'text-text-muted'
                          }`}>
                            <Clock size={12} />
                            {format(parseISO(task.dueDate), 'dd MMM · HH:mm')}
                          </span>
                        )}
                        {task.category && (
                          <span className="flex items-center gap-1.5 text-[12px] font-bold text-text-muted uppercase tracking-widest">
                            <Filter size={12} />
                            {task.category}
                          </span>
                        )}
                        {task.reminderAt && (
                          <span className="flex items-center gap-1.5 text-[12px] font-bold text-accent-orange uppercase tracking-widest">
                            <Bell size={12} />
                            {format(parseISO(task.reminderAt), 'dd MMM HH:mm')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => openEditModal(task)}
                        className="p-2 text-text-muted hover:text-accent-blue hover:bg-white/5 rounded-xl transition-all"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="p-2 text-text-muted hover:text-danger hover:bg-white/5 rounded-xl transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="all-tasks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {tasks.filter(t => filterStatus === 'ALL' || t.status === filterStatus).length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <List size={28} className="text-text-muted" />
                  </div>
                  <p className="text-[16px] font-black text-text-muted uppercase tracking-widest">No Tasks This Month</p>
                </div>
              ) : (
                tasks
                  .filter(t => filterStatus === 'ALL' || t.status === filterStatus)
                  .sort((a, b) => {
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                  })
                  .map(task => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-accent-blue/20 transition-all group"
                    >
                      <button
                        onClick={() => handleToggleComplete(task)}
                        className={`mt-0.5 shrink-0 transition-all ${task.status === 'COMPLETED' ? 'text-success' : 'text-text-muted hover:text-accent-blue'}`}
                      >
                        {task.status === 'COMPLETED' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className={`text-[16px] font-bold ${task.status === 'COMPLETED' ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                            {task.title}
                          </h3>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[task.priority]}`}>
                            {task.priority}
                          </span>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${STATUS_COLORS[task.status]}`}>
                            {task.status === 'IN_PROGRESS' ? 'ACTIVE' : task.status}
                          </span>
                        </div>

                        {task.description && (
                          <p className="text-[14px] text-text-muted mt-1.5 line-clamp-2">{task.description}</p>
                        )}

                        <div className="flex items-center gap-4 mt-2.5">
                          {task.dueDate && (
                            <span className={`flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-widest ${
                              task.status !== 'COMPLETED' && parseISO(task.dueDate) < new Date()
                                ? 'text-danger'
                                : 'text-text-muted'
                            }`}>
                              <Clock size={12} />
                              {format(parseISO(task.dueDate), 'dd MMM · HH:mm')}
                            </span>
                          )}
                          {task.category && (
                            <span className="flex items-center gap-1.5 text-[12px] font-bold text-text-muted uppercase tracking-widest">
                              <Filter size={12} />
                              {task.category}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => openEditModal(task)}
                          className="p-2 text-text-muted hover:text-accent-blue hover:bg-white/5 rounded-xl transition-all"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="p-2 text-text-muted hover:text-danger hover:bg-white/5 rounded-xl transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="card border-accent-blue/20 bg-bg-surface shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-black text-text-primary uppercase tracking-tight">
                    {editingTask ? 'Edit Task' : 'New Task'}
                  </h2>
                  <button onClick={() => setShowModal(false)} className="p-2 text-text-muted hover:text-text-primary hover:bg-white/5 rounded-xl transition-all">
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-black text-text-muted uppercase tracking-widest ml-1">Title *</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      placeholder="What needs to be done?"
                      className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[16px] font-bold text-text-primary outline-none focus:border-accent-blue transition-all"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] font-black text-text-muted uppercase tracking-widest ml-1">Description</label>
                    <textarea
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      placeholder="Add details..."
                      rows={3}
                      className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[15px] font-medium text-text-primary outline-none focus:border-accent-blue transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-black text-text-muted uppercase tracking-widest ml-1">Due Date</label>
                      <input
                        type="datetime-local"
                        value={form.dueDate}
                        onChange={e => setForm({ ...form, dueDate: e.target.value })}
                        className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[14px] font-bold text-text-primary outline-none focus:border-accent-blue transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-black text-text-muted uppercase tracking-widest ml-1">Reminder</label>
                      <input
                        type="datetime-local"
                        value={form.reminderAt}
                        onChange={e => setForm({ ...form, reminderAt: e.target.value })}
                        className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[14px] font-bold text-text-primary outline-none focus:border-accent-blue transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-black text-text-muted uppercase tracking-widest ml-1">Priority</label>
                      <select
                        value={form.priority}
                        onChange={e => setForm({ ...form, priority: e.target.value })}
                        className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[14px] font-bold text-text-primary outline-none focus:border-accent-blue transition-all"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-black text-text-muted uppercase tracking-widest ml-1">Category</label>
                      <input
                        type="text"
                        value={form.category}
                        onChange={e => setForm({ ...form, category: e.target.value })}
                        placeholder="e.g. Meeting, Call, Follow-up"
                        className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[14px] font-bold text-text-primary outline-none focus:border-accent-blue transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] font-black text-text-muted uppercase tracking-widest ml-1">Status</label>
                    <select
                      value={form.status}
                      onChange={e => setForm({ ...form, status: e.target.value })}
                      className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[14px] font-bold text-text-primary outline-none focus:border-accent-blue transition-all"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-xl text-[14px] font-black uppercase tracking-widest text-text-muted border border-white/10 hover:bg-white/5 transition-all"
                  >Cancel</button>
                  <button
                    onClick={handleSave}
                    className="flex-1 btn-primary py-3 text-[14px] font-black uppercase tracking-widest shadow-lg shadow-accent-purple/20"
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;
