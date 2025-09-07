"use client"
// Enhanced FeedbackForm.tsx - Community Engagement

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  category: z.string().min(1, "Please select a category"),
  rating: z.string().min(1, "Please provide a rating"),
  description: z.string().min(10, "Feedback must be at least 10 characters"),
})

export default function Community() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      rating: "",
      description: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    console.log("Community Feedback Submitted ✅", values)
    
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
      form.reset()
      setTimeout(() => setSubmitSuccess(false), 3000)
    }, 1500)
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 rounded-xl p-8 text-white shadow-xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Community Feedback</h2>
        <p className="opacity-90 text-lg">Help us improve CoastGuard+ for the entire coastal community</p>
      </div>

      {submitSuccess ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🙏</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Thank You for Your Valuable Feedback!</h3>
          <p className="opacity-90">Your insights help us build better coastal safety solutions for everyone.</p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-semibold">Feedback Category</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 backdrop-blur-sm">
                        <option value="" className="text-gray-800">Select category</option>
                        <option value="user_interface" className="text-gray-800">User Interface & Design</option>
                        <option value="app_features" className="text-gray-800">App Features & Functionality</option>
                        <option value="data_accuracy" className="text-gray-800">Data Accuracy & Reliability</option>
                        <option value="response_time" className="text-gray-800">Response Time & Performance</option>
                        <option value="relief_wallet" className="text-gray-800">Relief Wallet System</option>
                        <option value="community_features" className="text-gray-800">Community Features</option>
                        <option value="suggestions" className="text-gray-800">Feature Suggestions</option>
                        <option value="general" className="text-gray-800">General Feedback</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-semibold">Overall Experience</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 backdrop-blur-sm">
                        <option value="" className="text-gray-800">Rate your experience</option>
                        <option value="5" className="text-gray-800">⭐⭐⭐⭐⭐ Excellent (5/5)</option>
                        <option value="4" className="text-gray-800">⭐⭐⭐⭐ Very Good (4/5)</option>
                        <option value="3" className="text-gray-800">⭐⭐⭐ Good (3/5)</option>
                        <option value="2" className="text-gray-800">⭐⭐ Fair (2/5)</option>
                        <option value="1" className="text-gray-800">⭐ Needs Improvement (1/5)</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-semibold">Your Feedback</FormLabel>
                  <FormControl>
                    <Textarea 
                      className="w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white
                      placeholder-white focus:ring-2 focus:ring-white/50 min-h-[120px] backdrop-blur-sm" 
                      placeholder="Share your thoughts, suggestions, or concerns about CoastGuard+. What features would you like to see? How can we better serve the coastal community?"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-white/10 border border-white/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <span className="text-white text-lg">💡</span>
                <div className="text-sm text-white/90">
                  <p className="font-semibold mb-1">Your Voice Matters</p>
                  <p>Community feedback directly influences our development priorities and helps us build features that truly serve coastal residents.</p>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-white text-blue-600 hover:bg-gray-100 disabled:bg-gray-300 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Submitting Feedback...
                </span>
              ) : (
                'Submit Community Feedback'
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  )
}