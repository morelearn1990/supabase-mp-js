import SupabaseClient from './SupabaseClient'

describe('SupabaseClient', () => {
  it('should initialize successfully with valid credentials', () => {
    const supabaseUrl = 'https://abcdefghijklmno.supabase.co'
    const supabaseKey = 'dummy_key'

    const client = new SupabaseClient(supabaseUrl, supabaseKey, {
      global: {
        fetch: async (url: RequestInfo | URL, init?: RequestInit) => {
          return {} as Response
        },
      },
    })

    expect(client).toBeInstanceOf(SupabaseClient)
    expect(client.auth).toBeDefined()
    expect(client.storage).toBeDefined()
    expect(client.functions).toBeDefined()
  })

  it('should throw an error if supabaseUrl is missing', () => {
    expect(() => new SupabaseClient('', 'dummy_key')).toThrow('supabaseUrl is required.')
  })

  it('should throw an error if supabaseKey is missing', () => {
    // @ts-ignore
    expect(() => new SupabaseClient('https://abcdefghijklmno.supabase.co', '')).toThrow(
      'supabaseKey is required.'
    )
  })
})
